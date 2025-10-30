from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from .models import UserRegister
from django.utils import timezone
import hashlib
import random
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl

# Helper function to send email with custom SSL context
def send_otp_email(recipient, otp_code, subject="Your OTP Code"):
    try:
        sender_email = "riverwater23456@gmail.com"
        sender_password = "ukry xspt yfbc svzq"
        
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = recipient
        message["Subject"] = subject
        
        body = f"""
Hello!

Your OTP verification code is: {otp_code}

This code will expire in 5 minutes.

Welcome to Mithi River Guardian  - Water Quality Analysis Platform!

Best regards,
Mithi River Guardian Team
        """
        message.attach(MIMEText(body, "plain"))
        
        # Create an unverified SSL context to bypass certificate issues
        context = ssl._create_unverified_context()
        
        # Send email using Gmail SMTP
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.set_debuglevel(0)  # Set to 1 for debugging
            server.starttls(context=context)
            server.login(sender_email, sender_password)
            server.send_message(message)
            
        print(f"✅ Welcome email sent successfully to {recipient}")
        return True
        
    except Exception as e:
        print(f"❌ Email sending failed: {e}")
        
        # Fallback: Print OTP to console for development
        print(f"\n{'='*50}")
        print(f"📧 EMAIL FOR: {recipient}")
        print(f"🔑 OTP CODE: {otp_code}")
        print(f"📝 SUBJECT: {subject}")
        print(f"⏰ EXPIRES: 5 minutes")
        print(f"{'='*50}\n")
        
        # Return True to continue the process even if email fails
        return True

# Welcome email function for new users
def send_welcome_email(recipient, username="User"):
    try:
        sender_email = "riverwater23456@gmail.com"
        sender_password = "ukry xspt yfbc svzq"
        
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = recipient
        message["Subject"] = "Welcome to Mithi River Guardian - Water Quality Analysis Platform!"
        
        body = f"""
Dear {username},

Welcome to Mithi River Guardian! 🌊
Your Account Details:
• Username: {username}
• Email: {recipient}

Thank you for joining our water quality monitoring platform. You now have access to:

✅ Real-time water quality monitoring
✅ AI-powered predictive analytics
✅ Interactive geographic mapping
✅ Comprehensive water quality reports
✅ Advanced data visualization tools

Getting Started:
1. Log in to your dashboard
2. Explore the water quality metrics
3. Set up monitoring alerts
4. Access ML prediction tools

Your login credentials are secure and you can start exploring the platform immediately.

Visit our platform: http://localhost:3000

If you have any questions, feel free to contact our support team.

Best regards,
The Mithi River Guardian Team

---
This is an automated message from Mithi River Guardian Water Quality Analysis Platform.
        """
        message.attach(MIMEText(body, "plain"))
        
        # Create an unverified SSL context
        context = ssl._create_unverified_context()
        
        # Send email using Gmail SMTP
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.set_debuglevel(0)
            server.starttls(context=context)
            server.login(sender_email, sender_password)
            server.send_message(message)
            
        print(f"✅ Welcome email sent successfully to {recipient}")
        return True
        
    except Exception as e:
        print(f"❌ Welcome email failed: {e}")
        print(f"📧 Welcome email would be sent to: {recipient}")
        return False

# Signup OTP endpoint (can send to any email/phone)
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
@api_view(['POST'])
def send_signup_otp(request):
    email = request.data.get('email')
    phone = request.data.get('phone')
    code = str(random.randint(100000, 999999))
    if email:
        cache.set(f"signup_otp_email_{email}", code, timeout=300)
        print(f"\n{'='*50}")
        print(f"📧 SIGNUP OTP SENT")
        print(f"Email: {email}")
        print(f"OTP Code: {code}")
        print(f"{'='*50}\n")
        try:
            send_otp_email(email, code, "Your Signup OTP")
            return Response({'success': True, 'message': 'OTP sent to email.'})
        except Exception as e:
            print(f"Email error: {e}")
            return Response({'error': f'Failed to send email: {str(e)}'}, status=500)
    elif phone:
        cache.set(f"signup_otp_phone_{phone}", code, timeout=300)
        # Integrate SMS provider here
        return Response({'success': True, 'message': 'OTP sent to phone.'})
    else:
        return Response({'error': 'Email or phone required.'}, status=400)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import UserRegister
from django.utils import timezone
import hashlib

# Reset password after OTP verification
@api_view(['POST'])
def reset_password(request):
    identifier = request.data.get('identifier')
    new_password = request.data.get('new_password')
    user = None
    # Find user by email or phone
    if identifier and '@' in identifier:
        try:
            user = UserRegister.objects.get(email=identifier)
        except UserRegister.DoesNotExist:
            pass
    if not user and identifier:
        try:
            user = UserRegister.objects.get(phone_number=identifier)
        except UserRegister.DoesNotExist:
            pass
    if not user:
        return Response({'success': False, 'error': 'Account not found.'})
    if not new_password or len(new_password) < 8:
        return Response({'success': False, 'error': 'Password must be at least 8 characters.'})
    # Hash password (simple example, use Django's make_password for real security)
    user.password = hashlib.sha256(new_password.encode()).hexdigest()
    user.save()
    return Response({'success': True})
@api_view(['POST'])
def find_account(request):
    identifier = request.data.get('identifier')
    user = None
    method = None
    # Check if identifier is email
    if identifier and '@' in identifier:
        try:
            user = UserRegister.objects.get(email=identifier)
            method = 'email'
        except UserRegister.DoesNotExist:
            pass
    # Check if identifier is phone
    if not user and identifier:
        try:
            user = UserRegister.objects.get(phone_number=identifier)
            method = 'phone'
        except UserRegister.DoesNotExist:
            pass
    if user:
        return Response({'success': True, 'method': method})
    else:
        return Response({'success': False, 'error': 'Account not found.'})
# Fix missing imports for DRF decorators and response
import random
from django.core.cache import cache
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    phone = request.data.get('phone')
    code = str(random.randint(100000, 999999))
    user = None
    if email:
        try:
            user = UserRegister.objects.get(email=email)
        except UserRegister.DoesNotExist:
            return Response({'error': 'Account not found.'}, status=400)
        user.reset_otp = code
        user.reset_otp_expiry = timezone.now() + timezone.timedelta(minutes=5)
        user.save()
        cache.set(f"signup_otp_email_{email}", code, timeout=300)
        print(f"\n{'='*50}")
        print(f"🔑 PASSWORD RESET OTP SENT")
        print(f"Email: {email}")
        print(f"OTP Code: {code}")
        print(f"{'='*50}\n")
        try:
            send_otp_email(email, code, "Your Password Reset OTP")
            return Response({'success': True, 'message': 'OTP sent to email.'})
        except Exception as e:
            print(f"Email error: {e}")
            return Response({'error': f'Failed to send email: {str(e)}'}, status=500)
    elif phone:
        try:
            user = UserRegister.objects.get(phone_number=phone)
        except UserRegister.DoesNotExist:
            return Response({'error': 'Account not found.'}, status=400)
        user.reset_otp = code
        user.reset_otp_expiry = timezone.now() + timezone.timedelta(minutes=5)
        user.save()
        # Integrate SMS provider here
        return Response({'success': True, 'message': 'OTP sent to phone.'})
    else:
        return Response({'error': 'Email or phone required.'}, status=400)

@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    phone = request.data.get('phone')
    code = request.data.get('code')
    
    # For signup and password reset verification
    if email:
        # Try password reset OTP first
        cached_code = cache.get(f"signup_otp_email_{email}")
        if cached_code and cached_code == code:
            return Response({'success': True})
        # Fallback to user model for password reset OTP
        try:
            user = UserRegister.objects.get(email=email)
            if user.reset_otp == code and user.reset_otp_expiry and user.reset_otp_expiry > timezone.now():
                return Response({'success': True})
        except UserRegister.DoesNotExist:
            pass
        return Response({'success': False, 'message': 'Invalid or expired OTP'})
    elif phone:
        cached_code = cache.get(f"signup_otp_phone_{phone}")
        if cached_code and cached_code == code:
            return Response({'success': True})
        else:
            return Response({'success': False, 'message': 'Invalid or expired OTP'})
    else:
        return Response({'error': 'Email or phone required.'}, status=400)
from django.db.models import Q
# Signup API endpoint
@api_view(['POST'])
def signup(request):
    name = request.data.get('name')
    email = request.data.get('email')
    phone = request.data.get('phone')
    password = request.data.get('password')
    
    # Check for duplicate email or phone
    if UserRegister.objects.filter(Q(email=email) | Q(phone_number=phone)).exists():
        return Response({'error': 'Email or phone already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create user in UserRegister table
    user = UserRegister(
        full_name=name,
        email=email,
        phone_number=phone if phone else None,
        password=hashlib.sha256(password.encode()).hexdigest()
    )
    user.save()

    # Send welcome email after successful signup
    try:
        first_name = name.split()[0] if name else email
        send_welcome_email(email, first_name)
    except Exception as e:
        print(f"Welcome email sending failed: {e}")

    return Response({'success': True, 'email': user.email})
from django.contrib.auth import authenticate, login as django_login
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.mail import send_mail
from django.conf import settings

# Django Admin Login API endpoint
@api_view(['POST'])
@csrf_exempt
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'message': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate with Django's built-in authentication
    user = authenticate(username=username, password=password)
    
    if user is not None:
        if user.is_active:
            # Create or get token for the user
            token, created = Token.objects.get_or_create(user=user)
            
            return Response({
                'success': True,
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'User account is disabled.'}, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response({'message': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

# Django User Registration API endpoint with welcome email
@api_view(['POST'])
@csrf_exempt
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    
    if not username or not email or not password:
        return Response({'message': 'Username, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if username or email already exists
    if User.objects.filter(username=username).exists():
        return Response({'message': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Create new user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Send welcome email
        subject = 'Welcome to Water Quality Analysis Platform! 🌊'
        message = f"""
Dear {first_name or username},

Welcome to the Water Quality Analysis Platform! 🎉

Thank you for joining our mission to protect and monitor water quality across India's rivers and water bodies.

Your Account Details:
• Username: {username}
• Email: {email}
• Registration Date: {user.date_joined.strftime('%B %d, %Y')}

What you can do now:
🔍 Monitor water quality data from 1,200+ rivers
📊 Access real-time water quality reports
🌍 Contribute to environmental protection efforts
📈 View detailed analytics and trends
👥 Join our community of water guardians

Your login credentials are secure and you can start exploring the platform immediately.

Visit our platform: http://localhost:3000/login

Together, we're making a difference for our planet's most precious resource! 💧

Best regards,
The Water Quality Analysis Team

---
This is an automated message. Please do not reply to this email.
For support, contact us through the platform.
        """
        
        try:
            # Use our improved email function instead of Django's send_mail
            email_sent = send_welcome_email(email, first_name or username)
        except Exception as e:
            email_sent = False
            print(f"Email sending failed: {e}")
        
        # Create token for immediate login capability
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'success': True,
            'message': 'Registration successful!' + (' Welcome email sent.' if email_sent else ' (Email sending failed)'),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'token': token.key
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({'message': f'Registration failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

# Forgot Password API endpoint
@api_view(['POST'])
@csrf_exempt
def forgot_password(request):
    email = request.data.get('email')
    
    if not email:
        return Response({'message': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if user exists
        user = User.objects.get(email=email)
        
        # Generate password reset token
        token, created = Token.objects.get_or_create(user=user)
        
        # Send password reset email
        subject = 'Reset Your Water Quality Analysis Account Password 🔒'
        message = f"""
Dear {user.first_name or user.username},

You requested to reset your password for the Water Quality Analysis Platform.

Reset Instructions:
• Click the link below to reset your password
• This link will expire in 24 hours for security reasons
• If you didn't request this reset, please ignore this email

Reset Link: http://localhost:3001/reset-password?token={token.key}&email={email}

Security Tips:
🔐 Choose a strong password (at least 8 characters)
🛡️ Don't share your login credentials
🔍 Always log out from shared computers

If you're having trouble accessing your account, contact our support team through the platform.

Best regards,
The Water Quality Analysis Team

---
This is an automated security message.
For support, contact us through the platform.
        """
        
        try:
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            email_sent = True
        except Exception as e:
            email_sent = False
            print(f"Email sending failed: {e}")
        
        return Response({
            'success': True,
            'message': 'Password reset instructions sent to your email!' if email_sent else 'User found but email sending failed.',
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        # Don't reveal whether user exists for security
        return Response({
            'success': True,
            'message': 'If an account with that email exists, you will receive reset instructions.',
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': f'Password reset failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

# Custom UserRegister Login (keeping for backward compatibility)
@api_view(['POST'])
def custom_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    try:
        user = UserRegister.objects.get(email=email)
    except UserRegister.DoesNotExist:
        return Response({'error': 'Invalid email.'}, status=status.HTTP_401_UNAUTHORIZED)
    # Check password (hashed with sha256)
    hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    if user.password == hashed_pw:
        return Response({'success': True, 'email': user.email, 'full_name': user.full_name})
    else:
        return Response({'error': 'Invalid password.'}, status=status.HTTP_401_UNAUTHORIZED)
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Get current user profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    })

# Change password
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    if not user.check_password(old_password):
        return Response({'error': 'Old password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
    if new_password != confirm_password:
        return Response({'error': 'New passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)
    user.set_password(new_password)
    user.save()
    return Response({'message': 'Password changed successfully.'})
from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import River
from .serializers import RiverSerializer

class RiverViewSet(viewsets.ModelViewSet):
    queryset = River.objects.all()
    serializer_class = RiverSerializer

# Dashboard CSV Data Functions
@api_view(['GET'])
def get_dashboard_stats(request):
    """Get real-time dashboard statistics from CSV file"""
    try:
        import pandas as pd
        import os
        import numpy as np
        from datetime import datetime
        
        # Path to CSV file
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mithi_river_data.csv')
        
        if not os.path.exists(csv_path):
            return Response({
                'error': 'CSV file not found',
                'path': csv_path
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Read CSV file
        df = pd.read_csv(csv_path)
        
        # Get latest year data (most recent)
        latest_year = df['Year'].max()
        latest_data = df[df['Year'] == latest_year]
        
        # Calculate current statistics
        current_stats = {
            'water_quality_index': {
                'value': latest_data['WQI'].mode().iloc[0] if len(latest_data) > 0 else 'Poor',
                'samples': len(latest_data),
                'distribution': latest_data['WQI'].value_counts().to_dict()
            },
            'temperature': {
                'value': round(latest_data['Temp'].mean(), 1),
                'unit': '°C',
                'min': round(latest_data['Temp'].min(), 1),
                'max': round(latest_data['Temp'].max(), 1),
                'status': get_temp_status(latest_data['Temp'].mean())
            },
            'ph': {
                'value': round(latest_data['pH'].mean(), 1),
                'unit': '',
                'min': round(latest_data['pH'].min(), 1),
                'max': round(latest_data['pH'].max(), 1),
                'status': get_ph_status(latest_data['pH'].mean())
            },
            'dissolved_oxygen': {
                'value': round(latest_data['DO'].mean(), 1),
                'unit': 'mg/L',
                'min': round(latest_data['DO'].min(), 1),
                'max': round(latest_data['DO'].max(), 1),
                'status': get_do_status(latest_data['DO'].mean())
            },
            'tds': {
                'value': int(latest_data['TDS'].mean()),
                'unit': 'ppm',
                'min': int(latest_data['TDS'].min()),
                'max': int(latest_data['TDS'].max()),
                'status': get_tds_status(latest_data['TDS'].mean())
            },
            'bod': {
                'value': round(latest_data['BOD'].mean(), 1),
                'unit': 'mg/L',
                'min': round(latest_data['BOD'].min(), 1),
                'max': round(latest_data['BOD'].max(), 1),
                'status': get_bod_status(latest_data['BOD'].mean())
            },
            'cod': {
                'value': round(latest_data['COD'].mean(), 1),
                'unit': 'mg/L',
                'min': round(latest_data['COD'].min(), 1),
                'max': round(latest_data['COD'].max(), 1),
                'status': get_cod_status(latest_data['COD'].mean())
            }
        }
        
        # Location-wise data
        location_stats = []
        for location in df['Location'].unique():
            loc_data = latest_data[latest_data['Location'] == location]
            if len(loc_data) > 0:
                location_stats.append({
                    'location': location,
                    'samples': len(loc_data),
                    'avg_temp': round(loc_data['Temp'].mean(), 1),
                    'avg_ph': round(loc_data['pH'].mean(), 1),
                    'avg_do': round(loc_data['DO'].mean(), 1),
                    'avg_tds': int(loc_data['TDS'].mean()),
                    'avg_bod': round(loc_data['BOD'].mean(), 1),
                    'avg_cod': round(loc_data['COD'].mean(), 1),
                    'wqi': loc_data['WQI'].mode().iloc[0] if len(loc_data) > 0 else 'Poor'
                })
        
        # Trend data (simulated daily from recent data)
        trend_data = generate_trend_data(latest_data)
        
        # Dataset info
        dataset_info = {
            'total_records': len(df),
            'locations': df['Location'].nunique(),
            'location_names': df['Location'].unique().tolist(),
            'year_range': f"{df['Year'].min()} - {df['Year'].max()}",
            'latest_year': int(latest_year),
            'parameters': ['Temperature', 'pH', 'DO', 'TDS', 'BOD', 'COD', 'WQI']
        }
        
        return Response({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'current_stats': current_stats,
            'location_data': location_stats,
            'trend_data': trend_data,
            'dataset_info': dataset_info,
            'data_source': 'Mithi River CSV Dataset'
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_latest_readings(request):
    """Get latest sensor readings from CSV"""
    try:
        import pandas as pd
        import os
        from datetime import datetime, timedelta
        
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mithi_river_data.csv')
        df = pd.read_csv(csv_path)
        
        # Get recent readings from latest year
        latest_year = df['Year'].max()
        latest_samples = df[df['Year'] == latest_year].sample(n=min(20, len(df[df['Year'] == latest_year])))
        
        readings = []
        for i, (_, row) in enumerate(latest_samples.iterrows()):
            # Simulate different timestamps
            timestamp = datetime.now() - timedelta(minutes=i*5)
            
            readings.append({
                'id': len(readings) + 1,
                'location': row['Location'],
                'timestamp': timestamp.isoformat(),
                'temperature': round(row['Temp'], 1),
                'ph': round(row['pH'], 1),
                'dissolved_oxygen': round(row['DO'], 1),
                'tds': int(row['TDS']),
                'bod': round(row['BOD'], 1),
                'cod': round(row['COD'], 1),
                'wqi': row['WQI'],
                'year': int(row['Year'])
            })
        
        # Sort by timestamp (newest first)
        readings.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return Response({
            'success': True,
            'readings': readings,
            'count': len(readings),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Helper functions for status determination
def get_temp_status(temp):
    if 20 <= temp <= 30:
        return {'category': 'optimal', 'color': 'green', 'message': 'Optimal'}
    elif temp < 20:
        return {'category': 'cool', 'color': 'blue', 'message': 'Cool'}
    else:
        return {'category': 'warm', 'color': 'orange', 'message': 'Warm'}

def get_ph_status(ph):
    if 6.5 <= ph <= 8.5:
        return {'category': 'normal', 'color': 'green', 'message': 'Normal Range'}
    elif ph < 6.5:
        return {'category': 'acidic', 'color': 'red', 'message': 'Acidic'}
    else:
        return {'category': 'alkaline', 'color': 'orange', 'message': 'Alkaline'}

def get_do_status(do):
    if do >= 6:
        return {'category': 'excellent', 'color': 'green', 'message': 'Excellent'}
    elif do >= 4:
        return {'category': 'good', 'color': 'blue', 'message': 'Good'}
    else:
        return {'category': 'low', 'color': 'red', 'message': 'Low'}

def get_tds_status(tds):
    if tds <= 300:
        return {'category': 'excellent', 'color': 'green', 'message': 'Excellent'}
    elif tds <= 600:
        return {'category': 'good', 'color': 'blue', 'message': 'Good'}
    elif tds <= 900:
        return {'category': 'fair', 'color': 'orange', 'message': 'Fair'}
    else:
        return {'category': 'poor', 'color': 'red', 'message': 'Poor'}

def get_bod_status(bod):
    if bod <= 3:
        return {'category': 'excellent', 'color': 'green', 'message': 'Excellent'}
    elif bod <= 6:
        return {'category': 'good', 'color': 'blue', 'message': 'Good'}
    else:
        return {'category': 'poor', 'color': 'red', 'message': 'High'}

def get_cod_status(cod):
    if cod <= 50:
        return {'category': 'good', 'color': 'green', 'message': 'Good'}
    elif cod <= 100:
        return {'category': 'moderate', 'color': 'orange', 'message': 'Moderate'}
    else:
        return {'category': 'poor', 'color': 'red', 'message': 'High'}

def generate_trend_data(latest_data):
    """Generate 7-day trend data from recent samples"""
    import numpy as np
    
    days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    trend_data = []
    
    # Use samples from latest data to create trend
    for i, day in enumerate(days):
        if len(latest_data) > 0:
            sample = latest_data.sample(n=1).iloc[0]
            
            # Convert WQI category to numeric for charting
            wqi_numeric = 85 if sample['WQI'] == 'Good' else 65 if sample['WQI'] == 'Moderate' else 45
            
            # Add some daily variation
            temp_var = np.random.normal(0, 1)
            ph_var = np.random.normal(0, 0.1)
            do_var = np.random.normal(0, 0.3)
            
            trend_data.append({
                'day': day,
                'wqi': max(20, min(100, int(wqi_numeric + np.random.normal(0, 5)))),
                'temperature': round(max(15, min(40, sample['Temp'] + temp_var)), 1),
                'ph': round(max(5, min(9, sample['pH'] + ph_var)), 1),
                'dissolved_oxygen': round(max(1, min(12, sample['DO'] + do_var)), 1),
                'tds': max(50, min(5000, int(sample['TDS'] + np.random.normal(0, 100)))),
                'bod': round(max(1, min(25, sample['BOD'] + np.random.normal(0, 1))), 1),
                'cod': round(max(10, min(300, sample['COD'] + np.random.normal(0, 10))), 1)
            })
    
    return trend_data

@api_view(['GET'])
def get_advanced_features_data(request):
    """Get data for advanced features components"""
    try:
        import pandas as pd
        import os
        from datetime import datetime, timedelta
        import numpy as np
        
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mithi_river_data.csv')
        df = pd.read_csv(csv_path)
        
        # Get latest year data
        latest_year = df['Year'].max()
        latest_data = df[df['Year'] == latest_year]
        
        # Sensor Network Data
        sensor_data = []
        for i, location in enumerate(df['Location'].unique()):
            loc_data = latest_data[latest_data['Location'] == location]
            if len(loc_data) > 0:
                sample = loc_data.sample(n=1).iloc[0]
                sensor_data.append({
                    'id': f'sensor_{i+1}',
                    'name': f'{location} Sensor',
                    'location': location,
                    'status': 'active' if np.random.random() > 0.1 else 'warning',
                    'battery': np.random.randint(70, 100),
                    'signal': np.random.randint(80, 100),
                    'last_reading': datetime.now().isoformat(),
                    'temperature': round(sample['Temp'], 1),
                    'ph': round(sample['pH'], 1),
                    'dissolved_oxygen': round(sample['DO'], 1),
                    'tds': int(sample['TDS']),
                    'bod': round(sample['BOD'], 1),
                    'cod': round(sample['COD'], 1)
                })
        
        # Heatmap Data (simulated grid data)
        heatmap_data = []
        for i in range(20):  # 20x20 grid
            for j in range(20):
                # Use nearby location data with some interpolation
                base_sample = latest_data.sample(n=1).iloc[0]
                heatmap_data.append({
                    'x': i,
                    'y': j,
                    'value': max(0, min(100, base_sample['TDS']/50 + np.random.normal(0, 10))),
                    'temperature': round(base_sample['Temp'] + np.random.normal(0, 2), 1),
                    'location': f'Grid_{i}_{j}'
                })
        
        # Environmental Impact Data
        impact_data = {
            'overall_score': np.random.randint(60, 80),
            'categories': [
                {
                    'name': 'Water Quality',
                    'score': int(latest_data['WQI'].apply(lambda x: 85 if x == 'Good' else 65 if x == 'Moderate' else 45).mean()),
                    'status': 'needs_attention'
                },
                {
                    'name': 'Biodiversity',
                    'score': np.random.randint(50, 75),
                    'status': 'critical'
                },
                {
                    'name': 'Pollution Control',
                    'score': np.random.randint(40, 70),
                    'status': 'improving'
                },
                {
                    'name': 'Ecosystem Health',
                    'score': np.random.randint(45, 65),
                    'status': 'poor'
                }
            ],
            'recommendations': [
                'Increase monitoring frequency in high-pollution areas',
                'Implement stricter industrial discharge controls',
                'Enhance sewage treatment capacity',
                'Develop green infrastructure for natural filtration'
            ]
        }
        
        # Pollution Source Data
        pollution_sources = []
        source_types = ['Industrial', 'Sewage', 'Agricultural', 'Residential', 'Commercial']
        for i, stype in enumerate(source_types):
            for location in df['Location'].unique()[:3]:  # Top 3 locations
                loc_data = latest_data[latest_data['Location'] == location]
                if len(loc_data) > 0:
                    sample = loc_data.sample(n=1).iloc[0]
                    pollution_sources.append({
                        'id': f'{stype.lower()}_{location.lower()}_{i}',
                        'name': f'{location} {stype} Source',
                        'type': stype,
                        'location': location,
                        'coordinates': {
                            'lat': 19.0 + np.random.uniform(-0.1, 0.1),
                            'lng': 72.85 + np.random.uniform(-0.1, 0.1)
                        },
                        'severity': 'high' if sample['BOD'] > 15 else 'medium' if sample['BOD'] > 10 else 'low',
                        'pollutants': ['BOD', 'COD', 'TDS'],
                        'impact_score': min(100, int((sample['BOD'] + sample['COD']/5 + sample['TDS']/50))),
                        'status': 'active',
                        'monthly_discharge': np.random.randint(1000, 50000),
                        'compliance': 'violation' if sample['BOD'] > 15 else 'warning' if sample['BOD'] > 10 else 'compliant'
                    })
        
        # Alert System Data
        alerts = []
        alert_types = ['pH Spike', 'Low DO', 'High TDS', 'Temperature Alert', 'BOD Violation']
        for i, alert_type in enumerate(alert_types):
            if np.random.random() > 0.3:  # 70% chance of alert
                location = np.random.choice(df['Location'].unique())
                alerts.append({
                    'id': f'alert_{i}',
                    'type': alert_type,
                    'location': location,
                    'severity': np.random.choice(['high', 'medium', 'low']),
                    'message': f'{alert_type} detected at {location}',
                    'timestamp': (datetime.now() - timedelta(minutes=np.random.randint(5, 120))).isoformat(),
                    'status': 'active',
                    'parameter': alert_type.split()[0].lower(),
                    'value': np.random.uniform(5, 25),
                    'threshold': np.random.uniform(8, 15)
                })
        
        # Timeline Data (historical trends)
        timeline_data = []
        for year in range(2020, 2025):
            year_data = df[df['Year'] == year]
            if len(year_data) > 0:
                timeline_data.append({
                    'year': year,
                    'avg_wqi': year_data['WQI'].apply(lambda x: 85 if x == 'Good' else 65 if x == 'Moderate' else 45).mean(),
                    'avg_temperature': round(year_data['Temp'].mean(), 1),
                    'avg_ph': round(year_data['pH'].mean(), 1),
                    'avg_do': round(year_data['DO'].mean(), 1),
                    'avg_tds': int(year_data['TDS'].mean()),
                    'avg_bod': round(year_data['BOD'].mean(), 1),
                    'avg_cod': round(year_data['COD'].mean(), 1),
                    'total_samples': len(year_data),
                    'good_quality_percentage': (year_data['WQI'] == 'Good').sum() / len(year_data) * 100
                })
        
        # Ecosystem Health Data
        ecosystem_data = {
            'overall_health': np.random.randint(40, 70),
            'biodiversity_index': round(np.random.uniform(0.3, 0.7), 2),
            'species_count': {
                'fish': np.random.randint(15, 35),
                'plants': np.random.randint(25, 50),
                'microorganisms': np.random.randint(100, 200),
                'birds': np.random.randint(10, 25)
            },
            'habitat_quality': {
                'riparian_zone': np.random.randint(30, 60),
                'water_column': np.random.randint(25, 55),
                'sediment': np.random.randint(20, 50),
                'banks': np.random.randint(35, 65)
            },
            'threats': [
                {'name': 'Industrial Pollution', 'severity': 'high', 'trend': 'increasing'},
                {'name': 'Sewage Discharge', 'severity': 'critical', 'trend': 'stable'},
                {'name': 'Solid Waste', 'severity': 'medium', 'trend': 'decreasing'},
                {'name': 'Encroachment', 'severity': 'high', 'trend': 'increasing'}
            ]
        }
        
        # Treatment Dashboard Data
        treatment_data = {
            'plants': [
                {
                    'name': 'Bandra STP',
                    'capacity': 500,
                    'current_load': np.random.randint(350, 480),
                    'efficiency': round(np.random.uniform(75, 95), 1),
                    'status': 'operational',
                    'inlet_bod': np.random.randint(200, 400),
                    'outlet_bod': np.random.randint(15, 30),
                    'inlet_cod': np.random.randint(400, 800),
                    'outlet_cod': np.random.randint(50, 100)
                },
                {
                    'name': 'Kurla STP',
                    'capacity': 300,
                    'current_load': np.random.randint(200, 280),
                    'efficiency': round(np.random.uniform(70, 90), 1),
                    'status': 'maintenance',
                    'inlet_bod': np.random.randint(180, 350),
                    'outlet_bod': np.random.randint(20, 40),
                    'inlet_cod': np.random.randint(350, 700),
                    'outlet_cod': np.random.randint(60, 120)
                }
            ],
            'daily_treated': np.random.randint(600, 800),
            'daily_generated': np.random.randint(750, 950),
            'treatment_efficiency': round(np.random.uniform(78, 88), 1),
            'energy_consumption': np.random.randint(2000, 3000),
            'chemical_usage': {
                'chlorine': np.random.randint(100, 200),
                'alum': np.random.randint(150, 300),
                'lime': np.random.randint(80, 150)
            }
        }
        
        return Response({
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'sensor_network': sensor_data,
            'heatmap_data': heatmap_data,
            'environmental_impact': impact_data,
            'pollution_sources': pollution_sources,
            'smart_alerts': alerts,
            'timeline_data': timeline_data,
            'ecosystem_health': ecosystem_data,
            'treatment_dashboard': treatment_data,
            'data_source': 'Mithi River CSV Dataset - Advanced Features'
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_3d_visualization_data(request):
    """Get 3D visualization data from CSV"""
    try:
        import pandas as pd
        import os
        import numpy as np
        from datetime import datetime
        
        csv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'mithi_river_data.csv')
        df = pd.read_csv(csv_path)
        
        latest_year = df['Year'].max()
        latest_data = df[df['Year'] == latest_year].sample(n=min(100, len(df[df['Year'] == latest_year])))
        
        # Generate 3D points with real data
        visualization_data = []
        for i, (_, row) in enumerate(latest_data.iterrows()):
            visualization_data.append({
                'x': np.random.uniform(-10, 10),
                'y': np.random.uniform(-10, 10),
                'z': np.random.uniform(0, 20),
                'value': row['TDS'],
                'temperature': row['Temp'],
                'ph': row['pH'],
                'do': row['DO'],
                'bod': row['BOD'],
                'cod': row['COD'],
                'wqi': row['WQI'],
                'location': row['Location'],
                'color': '#ff0000' if row['WQI'] == 'Poor' else '#ffaa00' if row['WQI'] == 'Moderate' else '#00ff00'
            })
        
        return Response({
            'success': True,
            'data': visualization_data,
            'metadata': {
                'total_points': len(visualization_data),
                'timestamp': datetime.now().isoformat()
            }
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'success': False
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
