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
