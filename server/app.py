from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from twilio.rest import Client
import random

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)
# Enable CORS for all origins, allowing your frontend to connect
CORS(app)

# Twilio credentials loaded from .env file
account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_phone_number = os.getenv('TWILIO_PHONE_NUMBER')

# Initialize Twilio Client
client = Client(account_sid, auth_token)

# In-memory store for OTPs
# WARNING: This is for demonstration. Use a proper database in production.
otp_storage = {}

@app.route('/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        phone_number = data.get('phone')

        if not phone_number:
            return jsonify({"success": False, "message": "Phone number is missing"}), 400

        # Generate a random 6-digit OTP using the 'random' module
        otp_code = str(random.randint(100000, 999999))
        
        # Store the OTP for later verification
        otp_storage[phone_number] = otp_code
        print(f"Generated OTP: {otp_code} for {phone_number}")

        # Send the SMS using Twilio
        message = client.messages.create(
            from_=twilio_phone_number,
            to=phone_number,
            body=f"Your River Monitor verification code is: {otp_code}"
        )

        print(f"Twilio message SID: {message.sid}")
        return jsonify({"success": True, "message": "OTP sent successfully"})

    except Exception as e:
        print(f"Error sending OTP: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        phone_number = data.get('phone')
        otp_code = data.get('code')
        
        if not phone_number or not otp_code:
            return jsonify({"success": False, "message": "Phone number or OTP code is missing"}), 400

        # Check if the provided OTP matches the stored one
        if otp_storage.get(phone_number) == otp_code:
            # Clear the OTP after successful verification
            del otp_storage[phone_number]
            return jsonify({"success": True, "message": "OTP verified successfully"})
        else:
            return jsonify({"success": False, "message": "Invalid OTP. Please try again."}), 400

    except Exception as e:
        print(f"Error verifying OTP: {e}")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/')
def home():
    return jsonify({"message": "Flask backend running with Twilio."})

if __name__ == '__main__':
    app.run(debug=True, port=5000)