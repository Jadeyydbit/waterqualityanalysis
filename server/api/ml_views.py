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