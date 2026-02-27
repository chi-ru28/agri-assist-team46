# AgriAssist - Machine Learning Pipeline

This directory contains the complete Training and Deployment Pipeline for the AgriAssist AI models suitable for a Final-Year Project.

## 🏗 Directory Structure
```
ml/
 ├── dataset/                    # Place your images & csv files here
 ├── models/                     # Trained models (.h5 and .pkl) are saved here
 ├── training/                   # Model training scripts
 │    ├── train_crop_model.py    # CNN Transfer Learning script
 │    ├── train_fertilizer_model.py # Scikit-Learn Pipeline script
 ├── api/                        # FastAPI server deployment
 │    ├── main.py
 ├── requirements.txt            # Python dependencies
 └── README.md                   # This instruction file
```

## 🛠 1. Installation 
Ensure you have Python 3.9+ installed and running.
It is highly recommended to use a virtual environment:

```bash
cd ml
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

## 🧠 2. Training Models

### Train Fertilizer Recommendation (Tabular Random Forest)
```bash
cd training
python train_fertilizer_model.py
```
*Note: If no dataset exists, the script will automatically generate a dummy dataset in `dataset/fertilizer_data.csv` for demonstration!*

### Train Crop Disease Detection (MobileNetV2 CNN Image Classifier)
Before running this, you **must** place images in the respective category folders:
`ml/dataset/healthy/*.jpg`
`ml/dataset/rust/*.jpg`
`etc.`

```bash
cd training
python train_crop_model.py
```
This script handles Image Augmentation, Transfer Learning freezing, Early Stopping optimization, and Validation graph generation. It saves the resulting model as `crop_model.h5`.

## 🚀 3. Start the FastAPI Server
Once the models are saved into `ml/models/`, launch the deployment server:

```bash
cd api
uvicorn main:app --reload
```
The server will boot up at **`http://127.0.0.1:8000`**

To view the Swagger interactive API documentation, open: 
👉 **`http://127.0.0.1:8000/docs`**

## 🌐 4. Example Testing (cURL)

**Test Fertilizer Recommendation POST Endpoint:**
```bash
curl -X POST "http://127.0.0.1:8000/predict-fertilizer" \
     -H "Content-Type: application/json" \
     -d '{
            "Nitrogen": 105,
            "Phosphorus": 45,
            "Potassium": 88,
            "Temperature": 24.5,
            "Humidity": 65.2,
            "Soil_Type": "Loamy",
            "Crop_Type": "Wheat"
         }'
```

**Test Crop Image Detection POST Endpoint:**
```bash
curl -X POST "http://127.0.0.1:8000/predict-image" \
     -H "accept: application/json" \
     -H "Content-Type: multipart/form-data" \
     -F "file=@/path/to/your/leaf_image.jpg"
```
