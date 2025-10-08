# Placeholder API endpoint to fix ImproperlyConfigured error

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'rivers', views.RiverViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('profile/', views.user_profile),
    path('change-password/', views.change_password),
    path('login/', views.login),
    path('signup/', views.signup),
    path('send-otp', views.send_otp),
    path('send-signup-otp', views.send_signup_otp),
    path('verify-otp', views.verify_otp),
    path('find-account', views.find_account),
    path('reset-password', views.reset_password),
]

# Define your API endpoints here, e.g.:
# from . import views
# urlpatterns = [
#     path('rivers/', views.river_list),
# ]
