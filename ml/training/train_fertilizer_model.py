import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

# Configuration
DATASET_PATH = '../dataset/fertilizer_data.csv'
MODEL_SAVE_PATH = '../models/fertilizer_model.pkl'

def create_dummy_data():
    """Create a dummy dataset if none exists for testing."""
    os.makedirs('../dataset', exist_ok=True)
    if not os.path.exists(DATASET_PATH):
        print(f"Creating dummy dataset at {DATASET_PATH}...")
        data = {
            'Nitrogen': np.random.randint(0, 140, 500),
            'Phosphorus': np.random.randint(0, 140, 500),
            'Potassium': np.random.randint(0, 140, 500),
            'Temperature': np.random.uniform(20.0, 40.0, 500),
            'Humidity': np.random.uniform(40.0, 90.0, 500),
            'Soil_Type': np.random.choice(['Sandy', 'Loamy', 'Clay', 'Black', 'Red'], 500),
            'Crop_Type': np.random.choice(['Wheat', 'Maize', 'Cotton', 'Rice', 'Sugarcane'], 500),
            'Fertilizer_Name': np.random.choice(['Urea', 'DAP', '14-35-14', '28-28', '17-17-17', '20-20', '10-26-26'], 500)
        }
        df = pd.DataFrame(data)
        df.to_csv(DATASET_PATH, index=False)
        print("Dummy dataset created.")

def main():
    # Ensure model directory exists
    os.makedirs('../models', exist_ok=True)
    
    create_dummy_data()

    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    # Separate features and target
    X = df[['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity', 'Soil_Type', 'Crop_Type']]
    y = df['Fertilizer_Name']

    # Define categorical and numerical features
    numeric_features = ['Nitrogen', 'Phosphorus', 'Potassium', 'Temperature', 'Humidity']
    categorical_features = ['Soil_Type', 'Crop_Type']

    # Preprocessing Pipeline: StandardScaler for numbers, OneHotEncoder for text
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ]
    )

    # Full Pipeline: Preprocessing + Random Forest
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    print("Splitting data into 80/20 train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Random Forest Classifier...")
    pipeline.fit(X_train, y_train)

    # Evaluation
    print("Evaluating model...")
    y_pred = pipeline.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {acc * 100:.2f}%\n")
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    # Save Pipeline (includes both preprocessing and model)
    print(f"saving model to {MODEL_SAVE_PATH}...")
    joblib.dump(pipeline, MODEL_SAVE_PATH)
    print("Training complete!")

if __name__ == "__main__":
    main()
