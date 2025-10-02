import os
import smtplib
import random
import string
import psycopg2
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from werkzeug.security import generate_password_hash
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Load environment variables
load_dotenv()

# --- App Initialization ---
app = Flask(__name__)
CORS(app)

# --- In-memory OTP storage (for demonstration purposes) ---
otp_storage = {}

# --- Twilio Client Initialization ---
try:
    twilio_client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))
    verify_service_sid = os.getenv("TWILIO_VERIFY_SID")
    if not verify_service_sid:
        print("[WARNING] TWILIO_VERIFY_SERVICE_SID not found. SMS verification will be disabled.")
except Exception as e:
    print(f"[ERROR] Failed to initialize Twilio client: {e}")
    twilio_client = None
    verify_service_sid = None

# --- SMTP Configuration ---
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
SENDER_EMAIL = SMTP_USERNAME

# --- Database Connection ---
def get_db_connection():
    try:
        conn = psycopg2.connect(os.getenv('DATABASE_URL'))
        return conn
    except psycopg2.OperationalError as e:
        print(f"[ERROR] Could not connect to the database: {e}")
        return None

def check_db_connection():
    conn = get_db_connection()
    if conn:
        print("[SUCCESS] PostgreSQL database connected successfully!")
        conn.close()
    else:
        print("[FATAL] Database connection check failed.")

# --- Helper Function for Sending Email OTP ---
def send_email_otp(recipient_email):
    if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD]):
        return False, "Email service is not configured correctly on the server."
    otp = ''.join(random.choices(string.digits, k=6))
    otp_storage[recipient_email] = otp
    print(f"[INFO] Generated OTP for {recipient_email}: {otp}")
    message = MIMEMultipart("alternative")
    message["Subject"] = "Your Verification Code"
    message["From"] = SENDER_EMAIL
    message["To"] = recipient_email
    text = f"Hi,\n\nYour verification code is: {otp}\n\nThis code will expire in 10 minutes."
    html = f"""
    <html><body>
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
            <h2>Verification Code</h2>
            <p>Please use the following code to complete your registration:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 5px; background-color:#f0f0f0; padding: 10px 20px; display: inline-block; border-radius: 5px;">{otp}</p>
            <p>This code will expire in 10 minutes.</p>
        </div>
    </body></html>
    """
    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))
    try:
        if SMTP_PORT == 465:
            print(f"[INFO] Connecting to SMTP server (SSL) at {SMTP_SERVER}:{SMTP_PORT}...")
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        else:
            print(f"[INFO] Connecting to SMTP server (TLS) at {SMTP_SERVER}:{SMTP_PORT}...")
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        print(f"[SUCCESS] OTP email sent to {recipient_email}")
        return True, f"OTP sent to {recipient_email}!"
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")
        return False, "Failed to send OTP email."

# --- NEW: Helper function to send password reset email ---
def send_password_reset_email(user_email, token):
    if not all([SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD]):
        return False, "Email service is not configured correctly on the server."

    # NOTE: The reset URL should point to your frontend page
    reset_url = f"http://localhost:3000/reset-password?token={token}"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset Request"
    message["From"] = SENDER_EMAIL
    message["To"] = user_email

    text = f"Hi,\n\nTo reset your password, click the link below:\n{reset_url}\n\nIf you did not request this, please ignore this email."
    html = f"""
    <html><body>
        <p>Hi,<br>
        To reset your password, please click the link below:</p>
        <a href="{reset_url}">Reset Your Password</a>
        <p>If you did not request this, please ignore this email.</p>
    </body></html>
    """
    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))

    try:
        # Use the same logic as your OTP emailer
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SENDER_EMAIL, user_email, message.as_string())
        else:
            with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
                server.sendmail(SENDER_EMAIL, user_email, message.as_string())
        print(f"[SUCCESS] Password reset email sent to {user_email}")
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send password reset email: {e}")
        return False


# --- API ROUTES ---
@app.route('/api/send-otp', methods=['POST'])
def send_otp_route():
    data = request.get_json()
    phone = data.get('phone')
    email = data.get('email')
    if email:
        success, message = send_email_otp(email)
        return jsonify({"success": success, "message": message}), 200 if success else 500
    elif phone:
        if not twilio_client or not verify_service_sid:
            return jsonify({"success": False, "message": "SMS service not configured."}), 500
        try:
            verification = twilio_client.verify.v2.services(verify_service_sid).verifications.create(to=phone, channel='sms')
            if verification.status == 'pending':
                return jsonify({"success": True, "message": f"OTP sent to {phone}!"})
            else:
                return jsonify({"success": False, "message": "Failed to send OTP via SMS"}), 500
        except TwilioRestException:
            return jsonify({"success": False, "message": "Could not send SMS. Check phone number."}), 500
    else:
        return jsonify({"success": False, "message": "Phone or Email is required"}), 400

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp_route():
    data = request.get_json()
    phone = data.get('phone')
    email = data.get('email')
    code = data.get('code')
    if not code:
        return jsonify({"success": False, "message": "OTP code is required"}), 400
    if email:
        stored_otp = otp_storage.get(email)
        if stored_otp == code:
            del otp_storage[email]
            return jsonify({"success": True, "message": "OTP verified successfully!"})
        else:
            return jsonify({"success": False, "message": "Invalid or expired OTP."}), 400
    elif phone:
        if not twilio_client or not verify_service_sid:
            return jsonify({"success": False, "message": "SMS service not configured."}), 500
        try:
            verification_check = twilio_client.verify.v2.services(verify_service_sid).verification_checks.create(to=phone, code=code)
            if verification_check.status == 'approved':
                return jsonify({"success": True, "message": "OTP verified successfully!"})
            else:
                return jsonify({"success": False, "message": "Invalid or expired OTP."}), 400
        except TwilioRestException:
            return jsonify({"success": False, "message": "Error during Twilio OTP verification."}), 500
    else:
        return jsonify({"success": False, "message": "Phone or Email is required for verification"}), 400

@app.route('/api/register', methods=['POST'])
def register_user_route():
    data = request.get_json()
    full_name = data.get('full_name')
    username = data.get('username')
    phone_number = data.get('phone_number')
    email = data.get('email')
    password = data.get('password')
    if not all([full_name, username, password, (phone_number or email)]):
        return jsonify({"success": False, "error": "Missing required fields."}), 400
    hashed_password = generate_password_hash(password)
    sql_insert = """
        INSERT INTO user_register (full_name, username, phone_number, email, password)
        VALUES (%s, %s, %s, %s, %s) RETURNING id;
    """
    conn = get_db_connection()
    if not conn:
        return jsonify({"success": False, "error": "Database connection failed."}), 500
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM user_register WHERE username = %s OR email = %s", (username, email))
            if cur.fetchone():
                return jsonify({"success": False, "error": "Username or email already exists."}), 409
            cur.execute(sql_insert, (full_name, username, phone_number, email, hashed_password))
            user_id = cur.fetchone()[0]
            conn.commit()
        return jsonify({"success": True, "userId": user_id, "message": "Registration successful!"}), 201
    except Exception as e:
        print(f"[ERROR] Registration failed: {e}")
        return jsonify({"success": False, "error": "Registration failed due to server error."}), 500
    finally:
        conn.close()

# --- NEW: Forgot Password Route ---
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"success": False, "error": "Email is required."}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"success": False, "error": "Database connection failed."}), 500
        
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM user_register WHERE email = %s", (email,))
            user = cur.fetchone()

            if user:
                token = str(uuid.uuid4())
                expiry = datetime.utcnow() + timedelta(hours=1) # Token is valid for 1 hour
                cur.execute(
                    "UPDATE user_register SET reset_token = %s, reset_token_expiry = %s WHERE email = %s",
                    (token, expiry, email)
                )
                conn.commit()
                send_password_reset_email(email, token)
        
        # Always return a success message to prevent user enumeration attacks
        return jsonify({"success": True, "message": "If an account with that email exists, a password reset link has been sent."})

    except Exception as e:
        print(f"[ERROR] Forgot password process failed: {e}")
        return jsonify({"success": False, "error": "An internal server error occurred."}), 500
    finally:
        if conn:
            conn.close()

# --- NEW: Reset Password Route ---
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    if not token or not new_password:
        return jsonify({"success": False, "error": "Token and new password are required."}), 400

    conn = get_db_connection()
    if not conn:
        return jsonify({"success": False, "error": "Database connection failed."}), 500

    try:
        with conn.cursor() as cur:
            # Find user by token and check if the token is still valid
            cur.execute(
                "SELECT id FROM user_register WHERE reset_token = %s AND reset_token_expiry > %s",
                (token, datetime.utcnow())
            )
            user = cur.fetchone()

            if not user:
                return jsonify({"success": False, "error": "Invalid or expired token."}), 400
            
            user_id = user[0]
            hashed_password = generate_password_hash(new_password)

            # Update the password and clear the reset token
            cur.execute(
                "UPDATE user_register SET password = %s, reset_token = NULL, reset_token_expiry = NULL WHERE id = %s",
                (hashed_password, user_id)
            )
            conn.commit()

        print(f"[SUCCESS] Password has been reset for user ID: {user_id}")
        return jsonify({"success": True, "message": "Password has been reset successfully."})

    except Exception as e:
        print(f"[ERROR] Password reset failed: {e}")
        return jsonify({"success": False, "error": "An internal error occurred."}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    check_db_connection()
    app.run(debug=True, port=5000)

