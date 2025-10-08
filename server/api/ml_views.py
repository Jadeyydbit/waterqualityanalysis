"""
Mithi River Water Quality ML API Views
Provides prediction endpoints for linear regression and classification
"""

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import joblib
import numpy as np
import pandas as pd
import os
from django.conf import settings

# Global variables to store loaded models
ml_models = {
    'regression_models': None,
    'regression_scalers': None,
    'classifier_model': None,
    'classifier_scaler': None,
    'location_encoder': None,
    'model_metadata': None
}

def load_ml_models():
    """Load all ML models once when server starts"""
    try:
        base_path = os.path.dirname(os.path.abspath(__file__))
        server_path = os.path.dirname(base_path)
        
        # Load regression models
        ml_models['regression_models'] = joblib.load(os.path.join(server_path, 'mithi_regression_models.pkl'))
        ml_models['regression_scalers'] = joblib.load(os.path.join(server_path, 'mithi_regression_scalers.pkl'))
        
        # Load classifier model
        ml_models['classifier_model'] = joblib.load(os.path.join(server_path, 'mithi_classifier_model.pkl'))
        ml_models['classifier_scaler'] = joblib.load(os.path.join(server_path, 'mithi_classifier_scaler.pkl'))
        
        # Load encoders and metadata
        ml_models['location_encoder'] = joblib.load(os.path.join(server_path, 'location_encoder.pkl'))
        ml_models['model_metadata'] = joblib.load(os.path.join(server_path, 'model_metadata.pkl'))
        
        print("ML models loaded successfully!")
        return True
        
    except Exception as e:
        print(f"Error loading ML models: {str(e)}")
        return False

# Load models when module is imported
load_ml_models()

def calculate_wqi(temperature, dissolved_oxygen, ph, tds, bod, cod):
    """
    Calculate Water Quality Index (WQI) based on water quality parameters
    Uses a weighted approach based on Indian water quality standards
    """
    
    # Parameter weights (importance factors)
    weights = {
        'pH': 0.12,
        'DO': 0.17,
        'TDS': 0.19,
        'BOD': 0.22,
        'COD': 0.19,
        'Temp': 0.11
    }
    
    # Calculate sub-indices for each parameter
    # pH (optimal range: 6.5-8.5)
    if 6.5 <= ph <= 8.5:
        ph_index = 100
    elif 6.0 <= ph < 6.5 or 8.5 < ph <= 9.0:
        ph_index = 80
    elif 5.5 <= ph < 6.0 or 9.0 < ph <= 9.5:
        ph_index = 60
    elif 5.0 <= ph < 5.5 or 9.5 < ph <= 10.0:
        ph_index = 40
    else:
        ph_index = 20
    
    # Dissolved Oxygen (optimal: >6 mg/L)
    if dissolved_oxygen >= 6:
        do_index = 100
    elif dissolved_oxygen >= 4:
        do_index = 80
    elif dissolved_oxygen >= 2:
        do_index = 60
    elif dissolved_oxygen >= 1:
        do_index = 40
    else:
        do_index = 20
    
    # TDS (optimal: <500 mg/L)
    if tds <= 500:
        tds_index = 100
    elif tds <= 1000:
        tds_index = 80
    elif tds <= 2000:
        tds_index = 60
    elif tds <= 3000:
        tds_index = 40
    else:
        tds_index = 20
    
    # BOD (optimal: <3 mg/L)
    if bod <= 3:
        bod_index = 100
    elif bod <= 6:
        bod_index = 80
    elif bod <= 12:
        bod_index = 60
    elif bod <= 20:
        bod_index = 40
    else:
        bod_index = 20
    
    # COD (optimal: <20 mg/L)
    if cod <= 20:
        cod_index = 100
    elif cod <= 40:
        cod_index = 80
    elif cod <= 80:
        cod_index = 60
    elif cod <= 120:
        cod_index = 40
    else:
        cod_index = 20
    
    # Temperature (optimal: 20-30°C)
    if 20 <= temperature <= 30:
        temp_index = 100
    elif 15 <= temperature < 20 or 30 < temperature <= 35:
        temp_index = 80
    elif 10 <= temperature < 15 or 35 < temperature <= 40:
        temp_index = 60
    elif 5 <= temperature < 10 or 40 < temperature <= 45:
        temp_index = 40
    else:
        temp_index = 20
    
    # Calculate weighted WQI
    wqi = (
        weights['pH'] * ph_index +
        weights['DO'] * do_index +
        weights['TDS'] * tds_index +
        weights['BOD'] * bod_index +
        weights['COD'] * cod_index +
        weights['Temp'] * temp_index
    )
    
    return max(0, min(100, wqi))  # Ensure WQI is between 0 and 100

@api_view(['POST'])
def predict_water_quality(request):
    """
    Linear Regression Prediction API
    Predicts TDS, BOD, COD values based on input parameters
    """
    try:
        # Check if models are loaded
        if not ml_models['regression_models']:
            return Response({
                'error': 'ML models not loaded. Please check server configuration.'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Get input data
        data = request.data
        
        # Validate required fields
        required_fields = ['year', 'location', 'temp', 'do', 'ph']
        for field in required_fields:
            if field not in data:
                return Response({
                    'error': f'Missing required field: {field}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Prepare input data
        try:
            year = int(data['year'])
            location = data['location']
            temp = float(data['temp'])
            do_val = float(data['do'])
            ph = float(data['ph'])
            
            # Encode location
            try:
                location_encoded = ml_models['location_encoder'].transform([location])[0]
            except ValueError:
                # If location not in training data, use most common location
                location_encoded = 0
                
        except (ValueError, TypeError) as e:
            return Response({
                'error': f'Invalid input data format: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create feature array
        features = np.array([[year, location_encoded, temp, do_val, ph]])
        
        # Make predictions for each target
        predictions = {}
        for target in ['TDS', 'BOD', 'COD']:
            # Scale features
            scaler = ml_models['regression_scalers'][target]
            features_scaled = scaler.transform(features)
            
            # Predict
            model = ml_models['regression_models'][target]
            prediction = model.predict(features_scaled)[0]
            predictions[target] = round(float(prediction), 2)
        
        # Calculate Water Quality Index (WQI) based on predicted values
        wqi = calculate_wqi(temp, do_val, ph, predictions['TDS'], predictions['BOD'], predictions['COD'])
        predictions['WQI'] = round(float(wqi), 1)
        
        return Response({
            'success': True,
            'predictions': predictions,
            'input': {
                'year': year,
                'location': location,
                'temp': temp,
                'do': do_val,
                'ph': ph
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Prediction failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def classify_water_quality(request):
    """
    Random Forest Classification API
    Predicts WQI category (Good/Moderate/Poor) based on all water quality parameters
    """
    try:
        # Check if models are loaded
        if not ml_models['classifier_model']:
            return Response({
                'error': 'ML models not loaded. Please check server configuration.'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        # Get input data
        data = request.data
        
        # Validate required fields
        required_fields = ['year', 'location', 'temp', 'do', 'ph', 'tds', 'bod', 'cod']
        for field in required_fields:
            if field not in data:
                return Response({
                    'error': f'Missing required field: {field}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Prepare input data
        try:
            year = int(data['year'])
            location = data['location']
            temp = float(data['temp'])
            do_val = float(data['do'])
            ph = float(data['ph'])
            tds = float(data['tds'])
            bod = float(data['bod'])
            cod = float(data['cod'])
            
            # Encode location
            try:
                location_encoded = ml_models['location_encoder'].transform([location])[0]
            except ValueError:
                # If location not in training data, use most common location
                location_encoded = 0
                
        except (ValueError, TypeError) as e:
            return Response({
                'error': f'Invalid input data format: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create feature array
        features = np.array([[year, location_encoded, temp, do_val, ph, tds, bod, cod]])
        
        # Scale features
        features_scaled = ml_models['classifier_scaler'].transform(features)
        
        # Make prediction
        prediction = ml_models['classifier_model'].predict(features_scaled)[0]
        prediction_proba = ml_models['classifier_model'].predict_proba(features_scaled)[0]
        
        # Get class labels and probabilities
        classes = ml_models['classifier_model'].classes_
        probabilities = {cls: round(float(prob), 4) for cls, prob in zip(classes, prediction_proba)}
        
        return Response({
            'success': True,
            'prediction': prediction,
            'probabilities': probabilities,
            'input': {
                'year': year,
                'location': location,
                'temp': temp,
                'do': do_val,
                'ph': ph,
                'tds': tds,
                'bod': bod,
                'cod': cod
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Classification failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_model_info(request):
    """
    Get information about loaded ML models
    """
    try:
        if not ml_models['model_metadata']:
            return Response({
                'error': 'Model metadata not available'
            }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response({
            'success': True,
            'model_info': ml_models['model_metadata'],
            'available_locations': ml_models['location_encoder'].classes_.tolist() if ml_models['location_encoder'] else [],
            'models_loaded': {
                'regression': ml_models['regression_models'] is not None,
                'classifier': ml_models['classifier_model'] is not None,
                'location_encoder': ml_models['location_encoder'] is not None
            }
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to get model info: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def reload_models(request):
    """
    Reload ML models (useful for development)
    """
    try:
        success = load_ml_models()
        if success:
            return Response({
                'success': True,
                'message': 'Models reloaded successfully'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Failed to reload models'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except Exception as e:
        return Response({
            'error': f'Model reload failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)