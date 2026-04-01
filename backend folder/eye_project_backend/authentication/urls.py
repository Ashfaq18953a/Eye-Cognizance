from django.urls import path
from .views import RegisterView, LoginView, SendOTPView, LoginOTPView, PasswordResetSendOTPView, PasswordResetVerifyOTPView, ProfileView, ChangePasswordView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('send-otp/', SendOTPView.as_view()),
    path('login-otp/', LoginOTPView.as_view()),
    path('password-reset-send-otp/', PasswordResetSendOTPView.as_view()),
    path('password-reset-verify-otp/', PasswordResetVerifyOTPView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('change-password/', ChangePasswordView.as_view()),
]
