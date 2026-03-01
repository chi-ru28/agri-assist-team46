import os
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
from sklearn.metrics import classification_report, confusion_matrix

# Configuration
DATASET_DIR = '../dataset'
MODEL_SAVE_PATH = '../models/crop_model.h5'
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15
NUM_CLASSES = 5

def build_model():
    """Builds the transfer learning model based on MobileNetV2."""
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=IMG_SIZE + (3,))
    
    # Freeze the base model
    base_model.trainable = False
    
    # Custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(NUM_CLASSES, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=predictions)
    
    model.compile(optimizer=Adam(learning_rate=0.001), 
                  loss='categorical_crossentropy', 
                  metrics=['accuracy'])
    
    return model

def plot_history(history):
    """Plots training vs validation accuracy and loss."""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
    
    # Accuracy Plot
    ax1.plot(history.history['accuracy'], label='Train Accuracy')
    ax1.plot(history.history['val_accuracy'], label='Validation Accuracy')
    ax1.set_title('Model Accuracy')
    ax1.set_ylabel('Accuracy')
    ax1.set_xlabel('Epoch')
    ax1.legend(loc='lower right')
    
    # Loss Plot
    ax2.plot(history.history['loss'], label='Train Loss')
    ax2.plot(history.history['val_loss'], label='Validation Loss')
    ax2.set_title('Model Loss')
    ax2.set_ylabel('Loss')
    ax2.set_xlabel('Epoch')
    ax2.legend(loc='upper right')
    
    plt.savefig('training_history.png')
    plt.show()

def plot_confusion_matrix(y_true, y_pred, classes):
    """Plots and saves the confusion matrix."""
    cm = confusion_matrix(y_true, y_pred)
    plt.figure(figsize=(10, 8))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=classes, yticklabels=classes)
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    plt.savefig('confusion_matrix.png')
    plt.show()

def main():
    # Ensure models directory exists
    os.makedirs('../models', exist_ok=True)
    os.makedirs(DATASET_DIR, exist_ok=True)
    
    # Add dummy dataset directories if they don't exist to prevent errors
    classes = ['healthy', 'nitrogen_deficiency', 'rust', 'powdery_mildew', 'bacterial_blight']
    for cls in classes:
        os.makedirs(os.path.join(DATASET_DIR, cls), exist_ok=True)
        
    print("Checking dataset...")
    # NOTE: You need to place actual images in the `dataset` folder for training to work!

    # Data Augmentation & Preprocessing
    datagen = ImageDataGenerator(
        rescale=1./255,          # Normalize pixel values
        validation_split=0.2,    # 80/20 split
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest'
    )
    
    try:
        train_generator = datagen.flow_from_directory(
            DATASET_DIR,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            subset='training'
        )
        
        val_generator = datagen.flow_from_directory(
            DATASET_DIR,
            target_size=IMG_SIZE,
            batch_size=BATCH_SIZE,
            class_mode='categorical',
            subset='validation',
            shuffle=False
        )
    except Exception as e:
        print(f"Error loading dataset: {e}\nPlease add images to {DATASET_DIR}")
        return

    if train_generator.samples == 0:
         print("No images found! Put images in dataset/healthy/, dataset/rust/, etc.")
         return

    # Build Model
    print("Building model...")
    model = build_model()
    model.summary()
    
    # Callbacks for Performance Optimization
    callbacks = [
        EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True, verbose=1),
        ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-6, verbose=1),
        ModelCheckpoint(MODEL_SAVE_PATH, monitor='val_accuracy', save_best_only=True, verbose=1)
    ]
    
    # Train Model
    print("Starting training...")
    history = model.fit(
        train_generator,
        epochs=EPOCHS,
        validation_data=val_generator,
        callbacks=callbacks
    )
    
    # Plot Metrics
    plot_history(history)
    
    # Evaluate
    print("Evaluating model...")
    val_loss, val_acc = model.evaluate(val_generator)
    print(f"Final Validation Accuracy: {val_acc*100:.2f}%")
    
    # Confusion Matrix & Classification Report
    val_generator.reset()
    predictions = model.predict(val_generator)
    y_pred = np.argmax(predictions, axis=1)
    y_true = val_generator.classes
    class_labels = list(val_generator.class_indices.keys())
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=class_labels))
    
    plot_confusion_matrix(y_true, y_pred, class_labels)
    print(f"Training complete. Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    main()
