from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import UserRegister
from django.utils import timezone
import hashlib
import random
from django.core.cache import cache
from django.core.mail import send_mail
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
        
        body = f"Your OTP code is: {otp_code}\n\nThis code will expire in 5 minutes."
        message.attach(MIMEText(body, "plain"))
        
        # Create SSL context that doesn't verify certificates
        context = ssl.create_default_context()
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        
        # Send email using Gmail SMTP
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls(context=context)
            server.login(sender_email, sender_password)
            server.send_message(message)
        return True
    except Exception as e:
        print(f"Email sending error: {e}")
        raise e

# Signup OTP endpoint (can send to any email/phone)
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
    
    return Response({'success': True, 'email': user.email})
from django.contrib.auth import authenticate
# Login API endpoint
@api_view(['POST'])
def login(request):
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
