# Placeholder API endpoint to fix ImproperlyConfigured error

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import ml_views
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from routes import ai_views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'rivers', views.RiverViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', views.user_profile),
    path('change-password/', views.change_password),
    path('login/', views.login),
    path('register/', views.register),  # Django User registration with email
    path('forgot-password/', views.forgot_password),  # Password reset request
    path('signup/', views.signup),      # Custom UserRegister (legacy)
    path('send-otp', views.send_otp),
    path('send-signup-otp', views.send_signup_otp),
    path('verify-otp', views.verify_otp),
    path('find-account', views.find_account),
    path('reset-password', views.reset_password),
    
    # ML API endpoints
    path('ml/predict/', ml_views.predict_water_quality, name='ml_predict'),
    path('ml/classify/', ml_views.classify_water_quality, name='ml_classify'),
    path('ml/model-info/', ml_views.get_model_info, name='ml_model_info'),
    path('ml/reload/', ml_views.reload_models, name='ml_reload'),
    
    # AI-Powered Advanced Analytics endpoints
    path('ai/forecast/', ai_views.get_predictive_forecast, name='ai_forecast'),
    path('ai/anomalies/', ai_views.detect_anomalies, name='ai_anomalies'),
    path('ai/satellite/', ai_views.analyze_satellite_imagery, name='ai_satellite'),
    path('ai/reports/', ai_views.generate_ai_report, name='ai_reports'),
    path('ai/dashboard/', ai_views.get_ai_dashboard, name='ai_dashboard'),
    path('ai/status/', ai_views.get_ai_model_status, name='ai_status'),
]

# Define your API endpoints here, e.g.:
# from . import views
# urlpatterns = [
#     path('rivers/', views.river_list),
# ]
