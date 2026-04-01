
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegisterSerializer, UserSerializer, ChangePasswordSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import timedelta
from django.conf import settings
import random
from django.core.cache import cache
from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from django.core.mail import send_mail
from rest_framework.permissions import AllowAny
import firebase_admin
from firebase_admin import auth as firebase_auth, credentials
import os
import requests


# API to verify OTP and reset password
class PasswordResetVerifyOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        if not (email and otp and new_password):
            return Response({'error': 'Email, OTP, and new password are required'}, status=status.HTTP_400_BAD_REQUEST)
        cached_otp = cache.get(f'password_reset_otp_{email}')
        if not cached_otp or cached_otp != otp:
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            cache.delete(f'password_reset_otp_{email}')
            return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)

# OTP for password reset
class PasswordResetSendOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User with this email does not exist'}, status=status.HTTP_404_NOT_FOUND)
        otp = str(random.randint(100000, 999999))
        cache.set(f'password_reset_otp_{email}', otp, timeout=300)  # 5 minutes
        send_mail(
            'Your Password Reset OTP',
            f'Your OTP for password reset is: {otp}',
            'no-reply@eyecognizance.com',
            [email],
            fail_silently=False,
        )
        return Response({'message': 'OTP sent to email'}, status=status.HTTP_200_OK)

# Initialize Firebase Admin SDK (do this once)
if not firebase_admin._apps:
    cred_path = os.path.join(settings.BASE_DIR, 'firebase-adminsdk.json')  # Place your Firebase service account key here
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

# --- FAST2SMS OTP SYSTEM ---
class SendOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        mobile = request.data.get('mobile')
        if not mobile:
            return Response({'error': 'Mobile number is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        clean_mobile = "".join(filter(str.isdigit, str(mobile)))
        last_10 = clean_mobile[-10:] if len(clean_mobile) >= 10 else clean_mobile
        
        otp = str(random.randint(100000, 999999))
        cache.set(f'mobile_otp_{last_10}', otp, timeout=300)
        
        # --- Fast2SMS API Call (Quick SMS Route) ---
        # Note: 'q' (Quick SMS) route is verified to work without the ₹100 restriction on this account.
        api_key = getattr(settings, 'FAST2SMS_API_KEY', 'aLY7NxRbi5vQgmJTlBk2MIzDFhVE14wcPoqXWyfrCs6OZuG3pSsNgxwJknmKvZ6UlYG5rAILbVPiB2jh').strip()
        
        message = f"Your OTP is {otp}"
        url = f"https://www.fast2sms.com/dev/bulkV2?authorization={api_key}&route=q&message={message}&numbers={last_10}"

        try:
            print(f"DEBUG: Attempting to send OTP via Fast2SMS Quick Route (q)...")
            response = requests.get(url)
            resp_data = response.json()
            print(f"Fast2SMS Response: {resp_data}")
            
            if resp_data.get('return'):
                print(f"✅ SUCCESS: SMS sent successfully to {last_10}!")
            else:
                print(f"❌ FAILED: {resp_data.get('message')}")
        except Exception as e:
            print(f"Error sending SMS: {e}")
        
        # Backup console log
        print(f"\n[BACKUP LOG] OTP for {last_10} is: {otp}\n")
        
        return Response({
            'message': 'OTP sent! Please check your mobile.',
            'status': 'sent'
        }, status=status.HTTP_200_OK)

class LoginOTPView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        mobile = request.data.get('mobile')
        otp = request.data.get('otp')
        
        if not mobile or not otp:
            return Response({'error': 'Mobile and OTP are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Clean mobile
        clean_mobile = "".join(filter(str.isdigit, str(mobile)))
        last_10 = clean_mobile[-10:]
        
        # Check Cache
        cached_otp = cache.get(f'mobile_otp_{last_10}')
        if not cached_otp or cached_otp != str(otp):
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        User = get_user_model()
        # Find existing user or create new one
        user = User.objects.filter(mobile__endswith=last_10).first()
        
        if not user:
            # Create a new patient account if they don't exist
            username = f"user_{last_10}"
            email = f"{last_10}@mobile.com"
            user = User.objects.create_user(
                username=username,
                email=email,
                mobile=last_10,
                password=User.objects.make_random_password()
            )

        # Success - Clear OTP and return Tokens
        cache.delete(f'mobile_otp_{last_10}')
        update_last_login(None, user)
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_admin': user.is_staff or user.is_superuser,
            'user': {
                'id': user.id,
                'email': user.email,
                'mobile': user.mobile,
                'is_admin': user.is_staff or user.is_superuser
            }
        }, status=status.HTTP_200_OK)

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class LoginView(APIView):
    permission_classes = [AllowAny]  # <--- important

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "Invalid email or password"}, status=400)

        if not user.check_password(password):
            return Response({"error": "Invalid email or password"}, status=400)

        update_last_login(None, user)
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "is_admin": user.is_superuser
        })

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)

        if serializer.is_valid():
            if not user.check_password(serializer.data.get("old_password")):
                return Response({"error": "Wrong old password"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)