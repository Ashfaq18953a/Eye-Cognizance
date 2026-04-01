
import uuid
from datetime import datetime, timedelta

import razorpay
# Python Standard Library
import hmac
import hashlib
from datetime import datetime, timedelta, time
from collections import defaultdict
import threading
import time as time_module

# Third Party
import razorpay

# Django
from django.conf import settings
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.db import IntegrityError
from django.db.models import Count, Sum
from django.db.models.functions import TruncDay, TruncMonth
from django.core.mail import send_mail, EmailMultiAlternatives
from django.contrib.auth import get_user_model
from django.http import HttpResponse

# Django REST Framework
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.authentication import SessionAuthentication

# Local App Imports
from .models import (
    Appointment,
    SystemSettings,
    DoctorLeave,
    ContactMessage,
    AdminNotification
)

from .serializers import (
    AppointmentSerializer,
    SystemSettingsSerializer,
    AdminAppointmentSerializer,
    ContactMessageSerializer
)





# Initialize the Razorpay client once
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

# Custom User Model
User = get_user_model()

DEFAULT_TIME_SLOTS = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
    "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
    "07:00 PM", "07:30 PM"
]

def send_reminder_email_worker(appointment_id, recipient_email, appt_time_str, proxy_link, wait_seconds):
    """Wait and send the 5-minute reminder email."""
    if wait_seconds > 0:
        time_module.sleep(wait_seconds)
    
    # Re-fetch appointment to ensure it's not cancelled
    from .models import Appointment
    try:
        appt = Appointment.objects.get(id=appointment_id)
        if appt.status == "cancelled":
            return
            
        send_mail(
            subject="Reminder: Your Consultation Starts in 5 Minutes",
            message=(
                f"Dear {appt.patient_name or 'Patient'},\n\n"
                f"This is a reminder that your consultation is scheduled to start in 5 minutes.\n\n"
                f"Time: {appt_time_str}\n"
                f"Meeting Access Link: {proxy_link}\n\n"
                f"Please join immediately to prepare for your session.\n\n"
                "Thank you,\nEye Cognizance"
            ),
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        print(f"Reminder email sent to {recipient_email}")
    except Exception as e:
        print(f"Error sending reminder email: {e}")

def schedule_reminder(appointment, recipient_email, request):
    """Calculates wait time and spawns a thread to send the reminder."""
    appt_time = appointment.date_time
    reminder_time = appt_time - timedelta(minutes=5)
    now = timezone.now()
    
    wait_seconds = (reminder_time - now).total_seconds()
    
    # Prepare data for thread
    appt_time_str = appt_time.strftime('%I:%M %p')
    proxy_link = request.build_absolute_uri(f"/api/join-meeting/{appointment.id}/")
    
    # Start thread
    thread = threading.Thread(
        target=send_reminder_email_worker,
        args=(appointment.id, recipient_email, appt_time_str, proxy_link, wait_seconds)
    )
    thread.daemon = True
    thread.start()










from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def patient_list(request):
    from .models import Patient
    from django.db.models import Q
    
    # Show patients I explicitly own OR patients whose email/mobile matches my account
    user = request.user
    patients = Patient.objects.filter(
        Q(owner=user) | 
        Q(email=user.email) | 
        (Q(mobile=user.mobile) if user.mobile else Q(id=-1))
    ).distinct()
    
    # Return id for frontend to track existing patients
    data = [
        {
            "id": p.id,
            "name": p.name,
            "email": p.email,
            "mobile": p.mobile,
            "dob": p.dob,
            "gender": p.gender
        }
        for p in patients
    ]
    return Response(data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def patient_update(request, pk):
    from .models import Patient
    try:
        patient = Patient.objects.get(pk=pk, owner=request.user)
    except Patient.DoesNotExist:
        return Response({"error": "Patient not found or you don't have permission to update it"}, status=403)

    patient.name = request.data.get("name", patient.name)
    patient.email = request.data.get("email", patient.email)
    patient.mobile = request.data.get("mobile", patient.mobile)
    patient.dob = request.data.get("dob", patient.dob)
    patient.gender = request.data.get("gender", patient.gender)
    patient.save()

    return Response({
        "id": patient.id,
        "name": patient.name,
        "email": patient.email,
        "mobile": patient.mobile,
        "dob": patient.dob,
        "gender": patient.gender
    })




@api_view(["GET"])
@permission_classes([AllowAny])
def locked_slots(request):
    date_str = request.query_params.get("date")
    if not date_str:
        return Response({"slots": []})

    try:
        selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return Response({"slots": []})

    # Check if doctor is on leave
    if DoctorLeave.objects.filter(leave_date=selected_date).exists():
        time_format = "%I:%M %p"
        all_slots = []
        start_time = datetime.strptime("12:00 AM", time_format)
        for i in range(48):
            all_slots.append((start_time + timedelta(minutes=30*i)).strftime(time_format))
        return Response({"slots": all_slots})

    # Include timezone-aware start and end of day
    tz = timezone.get_current_timezone()
    start_datetime = timezone.make_aware(datetime.combine(selected_date, time.min), tz)
    end_datetime = timezone.make_aware(datetime.combine(selected_date, time.max), tz)

    # Fetch appointments within that day
    appointments = Appointment.objects.filter(date_time__range=(start_datetime, end_datetime)).exclude(status="cancelled")

    locked = [appt.date_time.astimezone(tz).strftime("%I:%M %p") for appt in appointments]

    locked = sorted(list(set(locked)))  # remove duplicates
    return Response({"slots": locked})

@api_view(["POST"])
@permission_classes([AllowAny])
def create_razorpay_order(request):
    amount = request.data.get("amount")

    if not amount:
        return Response({"success": False, "message": "Amount required"}, status=400)

    try:
        amount = int(amount)  # already in paise from frontend

        order = client.order.create({
            "amount": amount,   # ✅ DO NOT multiply again
            "currency": "INR",
            "payment_capture": 1
        })

        return Response({
            "success": True,
            "order_id": order["id"],
            "key": settings.RAZORPAY_KEY_ID,
            "amount": amount   # ✅ return same amount
        })

    except Exception as e:
        return Response({"success": False, "message": str(e)}, status=500)
# -------------------- VERIFY PAYMENT & CREATE BOOKING --------------------



 # adjust import paths as necessary


class VerifyPaymentAndCreateBooking(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data or {}

        # Patient details extraction & creation if needed
        if getattr(request, 'user', None) and request.user.is_authenticated:
            user = request.user
        else:
            patient_data = data.get("patient") or {}
            email = patient_data.get("email") or f"test{get_random_string(5)}@example.com"
            user = User.objects.filter(email=email).first()
            if not user:
                password = get_random_string(10)
                user = User.objects.create_user(
                    username=patient_data.get("name", email.split("@")[0]),
                    email=email,
                    mobile=patient_data.get("mobile", ""),
                    password=password
                )

        # Doctor fallback: pick first staff user or create dummy doctor
        doctor = User.objects.filter(is_staff=True).first()
        if not doctor:
            doctor = User.objects.create_user(
                username="doctor",
                email="doctor@example.com",
                password="doctor123",
                is_staff=True
            )

        # Parse and convert date/time to aware datetime object
        selected_date = data.get("selectedDate") or timezone.localdate().strftime("%Y-%m-%d")
        selected_time = data.get("selectedTime") or "12:00 PM"
        try:
            naive_dt = datetime.strptime(f"{selected_date} {selected_time}", "%Y-%m-%d %I:%M %p")
            date_time = timezone.make_aware(naive_dt, timezone.get_current_timezone())
        except Exception:
            date_time = timezone.now()

        # Payment amount in INR (assumed sent in paise, convert to rupees)
        sent_amount = int(data.get("totalAmount") or 100)  # default 100 paise = 1 INR

        # Generate unique meeting link for the appointment
        meeting_link = f"https://meet.jit.si/eye-cognizance-{uuid.uuid4().hex[:10]}"

        # Create appointment record
        patient_data = data.get("patient") or {}
        provided_name = patient_data.get("name") or user.username

        # Save patient info to Patient table (deduplicate by all three fields)
        from .models import Patient
        patient_obj, created = Patient.objects.get_or_create(
            name=provided_name,
            email=patient_data.get("email"),
            mobile=patient_data.get("mobile"),
            defaults={'owner': user}
        )
        if not created and not patient_obj.owner:
            patient_obj.owner = user
        if patient_data.get("dob"):
            patient_obj.dob = patient_data.get("dob")
        if patient_data.get("gender"):
            patient_obj.gender = patient_data.get("gender")
        patient_obj.save()

        appointment = Appointment.objects.create(
            patient=user,
            patient_name=provided_name,
            patient_email=patient_data.get("email"),
            patient_mobile=patient_data.get("mobile"),
            patient_dob=patient_data.get("dob") or None,
            patient_gender=patient_data.get("gender") or None,
            doctor=doctor,
            consultation_type=data.get("selectedType") or "video",
            date_time=date_time,
            payment_status="paid",
            meeting_link=meeting_link,
            amount=sent_amount / 100.0,  # convert paise to INR float
            razorpay_payment_id=data.get("razorpay_payment_id")
        )

        # Determine the recipient email (prefer the one from the form)
        recipient_email = patient_data.get("email") or user.email

        # Send confirmation email
        try:
            proxy_link = request.build_absolute_uri(f"/api/join-meeting/{appointment.id}/")
            
            send_mail(
                subject="Consultation Confirmed - Eye Cognizance",
                message=(
                    f"Dear {provided_name},\n\n"
                    f"Your consultation has been successfully booked.\n\n"
                    f"Details:\n"
                    f"  Date     : {date_time.strftime('%d %b %Y')}\n"
                    f"  Time     : {date_time.strftime('%I:%M %p')}\n"
                    f"  Type     : {data.get('selectedType', 'video').title()} Consultation\n"
                    f"  Link     : {proxy_link}\n\n"
                    f"Please click the link above to join your meeting. "
                    f"Please note: For security, this link will only activate EXACTLY 5 minutes before your scheduled appointment time, and will expire after the meeting ends.\n\n"
                    "Thank you for choosing Eye Cognizance!"
                ),
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[recipient_email],
                fail_silently=False,
            )
            print(f"Booking confirmation email sent to {recipient_email}")

            # Schedule the 5-minute reminder
            schedule_reminder(appointment, recipient_email, request)
        except Exception as e:
            print(f"Booking confirmation email error for {recipient_email}: {e}")

        # Return success response with booking ID and meeting link
        return Response({
            "success": True,
            "bookingId": appointment.id,
            "meetLink": proxy_link
        }, status=201)



class AdminPaymentView(APIView):
    permission_classes = []

class AdminPaymentView(APIView):
    permission_classes = []

    def get(self, request):
        date_str = request.query_params.get("date")

        qs = Appointment.objects.all().select_related("patient").order_by("-date_time")

        if date_str and date_str != "all":
            try:
                selected_date = datetime.strptime(date_str, "%Y-%m-%d").date()
                qs = qs.filter(date_time__date=selected_date)
            except ValueError:
                return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=400)

        data = []
        for appt in qs:
            display_name = appt.patient_name or (appt.patient.username if appt.patient else "N/A")
            data.append({
                "appointment_id": appt.id,
                "patient": display_name,
                "email": appt.patient_email or (appt.patient.email if appt.patient else "N/A"),
                "amount": appt.amount or 0,
                "payment_status": appt.payment_status or "pending",
                "paid": (appt.payment_status or "").lower() == "paid",
                "date": appt.date_time.isoformat() if appt.date_time else None,
                "razorpay_id": appt.razorpay_payment_id
            })

        return Response(data)


class GenerateInvoiceView(APIView):
    permission_classes = [AllowAny] 

    def get(self, request, pk):
        try:
            appt = Appointment.objects.get(id=pk)
            # Create a nice response for the invoice
            data = {
                "invoice_no": f"INV-{appt.id}-{appt.created_at.strftime('%Y%m%d')}",
                "date": appt.created_at.strftime("%d %b %Y"),
                "patient_name": appt.patient_name or (appt.patient.username if appt.patient else "N/A"),
                "patient_email": appt.patient_email or (appt.patient.email if appt.patient else "N/A"),
                "patient_mobile": appt.patient_mobile or (appt.patient.mobile if appt.patient else "N/A"),
                "consultation_type": appt.consultation_type.title(),
                "appointment_date": appt.date_time.strftime("%d %b %Y"),
                "appointment_time": appt.date_time.strftime("%I:%M %p"),
                "amount": appt.amount,
                "payment_status": appt.payment_status.title(),
                "razorpay_payment_id": appt.razorpay_payment_id or "N/A",
                "hospital_name": "Eye Cognizance",
                "hospital_address": "Flat 303, Emerald Heights, City Medical Center, New Delhi - 110001",
                "hospital_contact": "+91 99887 76655"
            }
            return Response(data)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)


class AdminPatientView(APIView):
    permission_classes = []

    def get(self, request):
        date_param = request.GET.get("date")
        from .models import Patient, Appointment
        from django.db.models import Count, Q

        # If date is 'all' or not provided, return all patients
        if not date_param or date_param == "all":
            patients_qs = Patient.objects.all()
            data = []
            for p in patients_qs:
                # Count appointments using email or mobile as a link
                total = Appointment.objects.filter(
                    Q(patient_email=p.email) | Q(patient_mobile=p.mobile)
                ).count()
                
                data.append({
                    "id": p.id,
                    "name": p.name,
                    "email": p.email,
                    "mobile": p.mobile,
                    "gender": p.gender,
                    "dob": p.dob,
                    "total_consultations": total
                })
            return Response(data)

        # Otherwise filter by date (existing logic but improved)
        try:
            selected_date = datetime.strptime(date_param, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format, use YYYY-MM-DD"}, status=400)

        # Get appointments for that day
        appointments = Appointment.objects.filter(date_time__date=selected_date)
        
        # Aggregate patients from those appointments
        unique_patients = {}
        for appt in appointments:
            key = f"{appt.patient_email}-{appt.patient_mobile}"
            if key not in unique_patients:
                # Subquery to get total history for this specific patient
                total_ever = Appointment.objects.filter(
                    Q(patient_email=appt.patient_email) | Q(patient_mobile=appt.patient_mobile)
                ).count()

                unique_patients[key] = {
                    "name": appt.patient_name,
                    "email": appt.patient_email,
                    "mobile": appt.patient_mobile,
                    "gender": appt.patient_gender,
                    "dob": appt.patient_dob,
                    "total_consultations": total_ever
                }
        
        return Response(list(unique_patients.values()))

class AdminUserListView(APIView):
    permission_classes = [] # 🔥 restrict in production

    def get(self, request):
        User = get_user_model()
        users = User.objects.all().order_by("-date_joined")
        data = []
        for u in users:
            data.append({
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "mobile": u.mobile,
                "is_admin": u.is_staff or u.is_superuser,
                "date_joined": u.date_joined.isoformat() if u.date_joined else None,
                "last_login": u.last_login.isoformat() if u.last_login else None
            })
        return Response(data)



class AdminAnalyticsView(APIView):
    permission_classes = []  # 🔥 temporarily remove for testing

    def get(self, request):
        import calendar
        now = timezone.localtime(timezone.now())
        today = now.date()
        
        tz = timezone.get_current_timezone()
        start_of_day = timezone.make_aware(datetime.combine(today, time.min), tz)
        end_of_day = timezone.make_aware(datetime.combine(today, time.max), tz)
        
        _, last_day = calendar.monthrange(today.year, today.month)
        start_of_month = timezone.make_aware(datetime.combine(today.replace(day=1), time.min), tz)
        end_of_month = timezone.make_aware(datetime.combine(today.replace(day=last_day), time.max), tz)

        # ✅ 1. Appointments Today
        appointments_today = Appointment.objects.filter(
            date_time__range=(start_of_day, end_of_day)
        ).exclude(status="cancelled").count()

        # ✅ 2. Today's Revenue
        today_revenue = Appointment.objects.filter(
            payment_status="paid",
            date_time__range=(start_of_day, end_of_day)
        ).exclude(status="cancelled").aggregate(total=Sum("amount"))["total"] or 0

        # ✅ 3. This Month's Revenue
        monthly_revenue = Appointment.objects.filter(
            payment_status="paid",
            date_time__range=(start_of_month, end_of_month)
        ).exclude(status="cancelled").aggregate(total=Sum("amount"))["total"] or 0

        # ✅ 4. Today's Consultation Type Counts
        type_counts = (
            Appointment.objects.filter(date_time__range=(start_of_day, end_of_day))
            .exclude(status="cancelled")
            .values("consultation_type")
            .annotate(count=Count("id"))
        )

        counts_dict = {"video": 0, "audio": 0, "message": 0}
        for item in type_counts:
            ctype = item["consultation_type"]
            if ctype in counts_dict:
                counts_dict[ctype] = item["count"]

        # ✅ 5. Total Patients (all time)
        total_patients = User.objects.filter(is_staff=False).count()

        return Response({
            "appointments_today": appointments_today,
            "today_revenue": today_revenue,
            "monthly_revenue": monthly_revenue,
            "video_today": counts_dict["video"],
            "audio_today": counts_dict["audio"],
            "message_today": counts_dict["message"],
            "total_patients": total_patients
        })

class AdminSendEmailView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        email = request.data.get('email')
        subject = request.data.get('subject')
        message = request.data.get('message')
        if not email or not subject or not message:
            return Response({"error": "email, subject, message required"}, status=status.HTTP_400_BAD_REQUEST)

        send_mail(subject, message, 'no-reply@eyecognizance.com', [email], fail_silently=False)
        return Response({"message": "Email sent"})



    permission_classes = [IsAdminUser]

    def get(self, request):
        settings_obj = SystemSettings.objects.first()
        if not settings_obj:
            settings_obj = SystemSettings.objects.create()
        serializer = SystemSettingsSerializer(settings_obj)
        return Response(serializer.data)

    def post(self, request):
        """
        Body example:
        {
            "locked_slots": {
                "2026-02-28": ["09:00 AM", "10:30 AM"],
                "2026-03-01": ["02:00 PM"]
            }
        }
        """
        settings_obj = SystemSettings.objects.first()
        if not settings_obj:
            settings_obj = SystemSettings.objects.create()

        locked_slots = request.data.get("locked_slots")
        if locked_slots:
            # Update only the locked_slots field
            settings_obj.locked_slots.update(locked_slots)
            settings_obj.save()

        serializer = SystemSettingsSerializer(settings_obj)
        return Response(serializer.data)




# class AdminAppointmentView(APIView):
#     permission_classes = []  # No restriction

#     def get(self, request):
#         date_param = request.GET.get("date")  # optional date filter
#         now = timezone.now()
#         qs = Appointment.objects.select_related("patient", "doctor").order_by("-date_time")

#         if date_param:
#             from datetime import datetime
#             try:
#                 selected_date = datetime.strptime(date_param, "%Y-%m-%d").date()
#                 qs = qs.filter(date_time__date=selected_date)
#             except ValueError:
#                 return Response({"error": "Invalid date format"}, status=400)

#         data = []
#         for appt in qs:
#             # Handle naive datetime
#             appt_dt = appt.date_time
#             if appt_dt and timezone.is_naive(appt_dt):
#                 appt_dt = timezone.make_aware(appt_dt)

#             status_value = "Scheduled"
#             if appt_dt:
#                 status_value = "Completed" if appt_dt < now else "Scheduled"

#             data.append({
#                 "id": appt.id,
#                 "patient_name": getattr(appt.patient, "username", "N/A"),
#                 "patient_email": getattr(appt.patient, "email", "N/A"),
#                 "consultation_type": appt.consultation_type,
#                 "date_time": appt.date_time.isoformat() if appt.date_time else None,
#                 "status": status_value,
#                 "payment_status": appt.payment_status,
#                 "meeting_link": appt.meeting_link,
#             })

#         return Response(data)

class AdminAppointmentDetailView(APIView):
    permission_classes = []  # No restriction for testing

    def delete(self, request, pk):
        try:
            appt = Appointment.objects.get(id=pk)
            patient_name = appt.patient_name or (appt.patient.username if appt.patient else "User")

            # ── Fetch payment method details from Razorpay ──────────────────
            refund_destination = "the original payment method"
            if appt.razorpay_payment_id:
                try:
                    payment_data = client.payment.fetch(appt.razorpay_payment_id)
                    method = payment_data.get("method", "")

                    if method == "upi":
                        vpa = payment_data.get("vpa", "")
                        refund_destination = f"UPI ID: {vpa}" if vpa else "UPI account"
                    elif method == "card":
                        card = payment_data.get("card", {}) or {}
                        network = card.get("network", "Card")
                        last4  = card.get("last4", "****")
                        refund_destination = f"{network} card ending in {last4}"
                    elif method == "netbanking":
                        bank = payment_data.get("bank", "bank account")
                        refund_destination = f"Net Banking – {bank}"
                    elif method == "wallet":
                        wallet = payment_data.get("wallet", "wallet")
                        refund_destination = f"Wallet: {wallet}"
                    else:
                        refund_destination = method if method else "the original payment method"

                    print(f"Admin View - Payment method detected: {method} → {refund_destination}")
                except Exception as e:
                    print(f"Admin View - Could not fetch payment details: {e}")

                # ── Initiate the actual refund ───────────────────────────────
                try:
                    client.payment.refund(appt.razorpay_payment_id, {
                        "amount": int(float(appt.amount) * 100)
                    })
                    print(f"SUCCESS: Admin refund initiated for payment {appt.razorpay_payment_id} to {refund_destination}")
                except Exception as e:
                    print("Admin Cancellation Refund Error:", e)

            appt.delete()
            return Response({
                "success": True,
                "message": f"{patient_name}'s appointment has been cancelled. A refund has been initiated to {refund_destination}.",
                "patient_name": patient_name
            })
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)


# views.py

# appointment/views.py



class AdminAppointmentView(APIView):
    permission_classes = []  # No restriction

    def get(self, request):
        date_param = request.GET.get("date")  # optional date filter
        now = timezone.now()

        qs = Appointment.objects.select_related("patient", "doctor").order_by("-date_time")

        if date_param:
            try:
                selected_date = datetime.strptime(date_param, "%Y-%m-%d").date()
                tz = timezone.get_current_timezone()
                start_dt = timezone.make_aware(datetime.combine(selected_date, time.min), tz)
                end_dt = timezone.make_aware(datetime.combine(selected_date, time.max), tz)
                qs = qs.filter(date_time__range=(start_dt, end_dt)).exclude(status="cancelled")
            except ValueError:
                return Response({"error": "Invalid date format"}, status=400)
        else:
            qs = qs.exclude(status="cancelled")

        data = []

        for appt in qs:
            data.append({
                "id": appt.id,
                # Patient details
                "patient_name": appt.patient_name or getattr(appt.patient, "username", "N/A"),
                "patient_email": getattr(appt.patient, "email", "N/A"),
                "patient_phone": getattr(appt.patient, "mobile", "N/A"), # use mobile
                "patient_dob": appt.patient_dob,

                # Consultation info
                "consultation_type": appt.consultation_type,
                "date_time": appt.date_time.isoformat() if appt.date_time else None,
                "status": appt.computed_status,

                # Payment
                "payment_status": appt.payment_status,

                # Meeting: Use proxy link and handle expiration
                "meeting_link": request.build_absolute_uri(f"/api/join-meeting/{appt.id}/") if not appt.meeting_expired else None,
                "meeting_expired": appt.meeting_expired,
            })

        return Response(data)

class AdminAppointmentDetailView(APIView):
    permission_classes = []  # No restriction for testing

    def delete(self, request, pk):
        try:
            appt = Appointment.objects.get(id=pk)
            patient_name = appt.patient_name or (appt.patient.username if appt.patient else "User")
            
            if appt.razorpay_payment_id:
                try:
                    client.payment.refund(appt.razorpay_payment_id, {
                        "amount": int(appt.amount * 100)
                    })
                except Exception as e:
                    print("Admin Cancellation Refund Error:", e)
            appt.status = "cancelled"
            appt.payment_status = "refunded"
            appt.save()
            return Response({
                "success": True, 
                "message": "Patient's appointment has been cancelled successfully. A refund has been initiated to the original payment method.",
                "patient_name": patient_name
            })
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)


# views.py


class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return  # Disable CSRF check


class AdminSettingsView(APIView):
    authentication_classes = [CsrfExemptSessionAuthentication]  # Custom auth without CSRF
    permission_classes = [AllowAny]

    TIME_FORMAT = "%I:%M %p"

    def generate_slots(self, start_time, end_time, duration):
        slots = []
        try:
            start_dt = datetime.strptime(start_time, self.TIME_FORMAT)
            end_dt = datetime.strptime(end_time, self.TIME_FORMAT)
        except:
            return slots

        current = start_dt
        while current < end_dt:
            slots.append(current.strftime(self.TIME_FORMAT))
            current += timedelta(minutes=duration)
        return slots

    def get(self, request):
        date = request.GET.get("date")
        settings_obj, _ = SystemSettings.objects.get_or_create()
        available_data = settings_obj.locked_slots or {}
        custom_ranges_data = settings_obj.custom_time_ranges or {}

        if not date:
            return Response({
                "available_data": available_data,
                "custom_ranges_data": custom_ranges_data,
                "slot_duration": settings_obj.slot_duration_minutes
            })

        return Response({
            "available_slots": available_data.get(date, []),
            "time_ranges": custom_ranges_data.get(date, [])
        })

    def post(self, request):
        date = request.data.get("date")
        time_ranges = request.data.get("time_ranges", [])
        time_constraint = int(request.data.get("time_constraint", 30))

        if not date:
            return Response({"error": "Date is required"}, status=400)

        settings_obj, _ = SystemSettings.objects.get_or_create()
        available_data = settings_obj.locked_slots or {}
        custom_ranges_data = settings_obj.custom_time_ranges or {}

        # DELETE Action: 
        # If no valid time ranges are provided, remove override for this date.
        # This makes it revert to the "normal" continuous slots.
        if not time_ranges or len(time_ranges) == 0 or (len(time_ranges) == 1 and not time_ranges[0].get("from")):
            if str(date) in available_data:
                del available_data[str(date)]
            if str(date) in custom_ranges_data:
                del custom_ranges_data[str(date)]
                
            settings_obj.locked_slots = available_data
            settings_obj.custom_time_ranges = custom_ranges_data
            settings_obj.save()
            
            return Response({
                "message": "Availability rules removed, reverted to default schedule.",
                "available_slots": [],
                "time_ranges": []
            })


        generated_slots = []

        for r in time_ranges:
            start = r.get("from")
            end = r.get("to")
            if not start or not end:
                continue
            duration = int(r.get("duration", time_constraint))
            generated_slots.extend(self.generate_slots(start, end, duration))

        generated_slots = sorted(
            list(set(generated_slots)),
            key=lambda x: datetime.strptime(x, self.TIME_FORMAT)
        )

        if not isinstance(available_data, dict):
            available_data = {}
        if not isinstance(custom_ranges_data, dict):
            custom_ranges_data = {}

        available_data[str(date)] = generated_slots
        custom_ranges_data[str(date)] = time_ranges

        settings_obj.locked_slots = available_data
        settings_obj.custom_time_ranges = custom_ranges_data
        settings_obj.slot_duration_minutes = time_constraint
        settings_obj.save()
                                    
        return Response({
            "message": "Availability saved successfully",
            "available_slots": generated_slots,
            "time_ranges": time_ranges
        })

class AdminRevenueView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Daily revenue for the last 30 days
        daily_revenue = (
            Appointment.objects.filter(payment_status="paid", date_time__gte=timezone.now()-timezone.timedelta(days=30))
            .annotate(day=TruncDay('date_time'))
            .values('day')
            .annotate(total=Sum('amount'))
            .order_by('day')
        )

        # Monthly revenue for the last 12 months
        monthly_revenue = (
            Appointment.objects.filter(payment_status="paid", date_time__gte=timezone.now()-timezone.timedelta(days=365))
            .annotate(month=TruncMonth('date_time'))
            .values('month')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        return Response({
            "daily_revenue": list(daily_revenue),
            "monthly_revenue": list(monthly_revenue),
        })




class PatientAppointmentStatusView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        mobile = request.GET.get("mobile")
        booking_id = request.GET.get("bookingId")
        
        if not mobile and not booking_id:
            return Response({"error": "Mobile number or Booking ID is required"}, status=400)
            
        now = timezone.now()
        
        if booking_id:
            # Clean the booking ID (remove prefixes like BK-2024-)
            import re
            clean_id = booking_id
            if '-' in booking_id:
                parts = booking_id.split('-')
                clean_id = parts[-1] # Take the last part (the numeric ID)
            
            try:
                appt = Appointment.objects.get(id=clean_id)
            except (Appointment.DoesNotExist, ValueError):
                return Response({"error": f"Invalid Booking ID: {booking_id}."}, status=404)
        else:
            # Searching by mobile requires authentication
            if not request.user.is_authenticated:
                return Response({"error": "You must be logged in to search by mobile number."}, status=401)
            
            from django.db.models import Q
            
            # Clean the search term (keep only digits)
            clean_mobile = "".join(filter(str.isdigit, mobile)) if mobile else ""
            
            if not clean_mobile:
                return Response({"error": "Invalid mobile number format."}, status=400)

            # Search in the user's account
            all_user_appts = Appointment.objects.filter(patient=request.user)
            
            # Filter by matching mobile (flexible matching)
            # Use icontains so that "9876" matches "+91 9876..."
            appointments = all_user_appts.filter(
                Q(patient_mobile__icontains=clean_mobile) | 
                Q(patient__mobile__icontains=clean_mobile)
            ).order_by('date_time')
            
            # Prefer the earliest upcoming appointment, fallback to the latest completed appointment
            upcoming = appointments.filter(date_time__gte=now).first()
            past = appointments.filter(date_time__lt=now).last()
            appt = upcoming or past
            
            if not appt:
                return Response({"error": f"No appointment found for mobile '{mobile}' in your account."}, status=404)
            
        display_name = appt.patient_name or (appt.patient.username if appt.patient else "Unknown")
            
        return Response({
            "id": appt.id,
            "patient_name": display_name,
            "date_time": appt.date_time.isoformat() if appt.date_time else None,
            "status": appt.status,
            "doctor_name": "Maimunissa",
            "consultation_type": appt.consultation_type,
            "amount": appt.amount,
            "patient_dob": appt.patient_dob,
            "payment_status": appt.payment_status,
            "transaction_id": getattr(appt, 'razorpay_payment_id', 'N/A'),
            "meeting_link": request.build_absolute_uri(f"/api/join-meeting/{appt.id}/"),
        })

class PatientRescheduleOrRefundView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            appt = Appointment.objects.get(id=pk)
            return Response({
                "doctor_name": "Maimunissa",
                "date_time": appt.date_time.isoformat(),
                "consultation_type": appt.consultation_type,
                "amount": appt.amount
            })
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

    def post(self, request, pk):
        action = request.data.get("action")
        try:
            appt = Appointment.objects.get(id=pk)
            
            # Prefer the patient_email from booking, fallback to account email
            recipient_email = appt.patient_email or (appt.patient.email if appt.patient else None)
            display_name = appt.patient_name or (appt.patient.username if appt.patient else "Patient")

            if action == "cancel":
                # ── Initiate Razorpay Refund ─────────────────────────────
                refund_destination = "your original payment method"
                if appt.razorpay_payment_id:
                    try:
                        # Fetch method for email
                        payment_data = client.payment.fetch(appt.razorpay_payment_id)
                        method = payment_data.get("method", "")
                        if method == "upi":
                            refund_destination = f"UPI ID: {payment_data.get('vpa', '')}"
                        elif method == "card":
                            refund_destination = f"Card ending in {payment_data.get('card', {}).get('last4', '****')}"
                        else:
                            refund_destination = f"{method} account"

                        # Actual Refund
                        client.payment.refund(appt.razorpay_payment_id, {
                            "amount": int(float(appt.amount) * 100)
                        })
                        print(f"Leave Refund: Successfully initiated for {appt.razorpay_payment_id}")
                    except Exception as e:
                        print(f"Leave Refund Error: {e}")
                
                # Update status
                appt.status = "cancelled"
                appt.payment_status = "refunded"
                appt.save()

                # Send refund confirmation email
                if recipient_email:
                    subject = "Appointment Refunded - Eye Cognizance"
                    message = (
                        f"Dear {display_name},\n\n"
                        f"As per your request, we have cancelled your appointment and initiated a full refund.\n\n"
                        f"Refund Details:\n"
                        f"  Amount     : Rs. {appt.amount}\n"
                        f"  Refund To  : {refund_destination}\n"
                        f"  Expected   : Within 3-5 business days\n\n"
                        f"Regards,\n"
                        f"Eye Cognizance Clinic"
                    )
                    try:
                        send_mail(subject, message, settings.EMAIL_HOST_USER, [recipient_email], fail_silently=False)
                    except Exception as e:
                        print(f"Reschedule-Refund Email Error: {e}")

                return Response({"success": True, "refund_status": f"Refunded to {refund_destination}"})

            elif action == "reschedule":
                # Reschedule status is handled by redirecting on frontend, 
                # but we mark it here so it doesn't show as 'cancelled' in stats
                appt.status = "rescheduling" 
                appt.save()
                return Response({"success": True})

            return Response({"error": "Invalid action"}, status=400)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

class JoinMeetingProxyView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        from django.shortcuts import redirect
        from django.utils import timezone
        
        try:
            appt = Appointment.objects.get(pk=pk)
        except Appointment.DoesNotExist:
            return HttpResponse("Appointment not found.", status=404)
            
        now = timezone.now()
        appt_time = appt.date_time
        
        # 5 minutes before
        time_to_activate = appt_time - timedelta(minutes=5)
        
        if now < time_to_activate:
            minutes_left = int((time_to_activate - now).total_seconds() / 60)
            return HttpResponse(
                f"<div style='font-family: sans-serif; text-align: center; margin-top: 100px;'>"
                f"<h1>Waiting Room - Too Early</h1>"
                f"<p>You can strictly only join this meeting exactly 5 minutes before it starts.</p>"
                f"<p>Please wait <b>{minutes_left} more minute(s)</b> and refresh the page.</p>"
                f"</div>", 
                status=403
            )
            
        if appt.meeting_expired:
            return HttpResponse(
                f"<div style='font-family: sans-serif; text-align: center; margin-top: 100px;'>"
                f"<h1>Meeting Expired</h1>"
                f"<p>This meeting has already ended.</p>"
                f"</div>", 
                status=403
            )
            
        if not appt.meeting_link:
            return HttpResponse("<h1>No Link Available</h1>", status=404)
            
        return redirect(appt.meeting_link)

class PatientFreeRescheduleView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        old_appt_id = request.data.get("oldApptId")
        selected_date = request.data.get("selectedDate")
        selected_time = request.data.get("selectedTime")
 
        try:
            old_appt = Appointment.objects.get(id=old_appt_id)

            naive_dt = datetime.strptime(f"{selected_date} {selected_time}", "%Y-%m-%d %I:%M %p")
            date_time = timezone.make_aware(naive_dt, timezone.get_current_timezone())

            old_appt.date_time = date_time
            old_appt.status = "scheduled"
            old_appt.save()

            proxy_link = request.build_absolute_uri(f"/api/join-meeting/{old_appt.id}/")

            # Send confirmation email for the new booking
            if old_appt.patient and getattr(old_appt.patient, 'email', None):
                time_str = timezone.localtime(old_appt.date_time).strftime('%d %b %Y at %I:%M %p')
                subject = "Consultation Rescheduled Successfully"
                message = (
                    f"Dear {getattr(old_appt.patient, 'username', 'Patient')},\n\n"
                    f"Your consultation has been successfully rescheduled.\n"
                    f"New Date & Time: {time_str}\n"
                    f"Meeting Link: {proxy_link}\n\n"
                    f"Please note: For security, this link will only activate EXACTLY 5 minutes before your scheduled appointment time.\n\n"
                    f"Thank you for your patience!\n\n"
                    f"Regards,\n"
                    f"Eye Cognizance Clinic"
                )
                try:
                    send_mail(subject, message, settings.EMAIL_HOST_USER, [old_appt.patient.email], fail_silently=True)
                except Exception:
                    pass
                
                # Schedule reminder for rescheduled slot
                schedule_reminder(old_appt, old_appt.patient.email, request)

            return Response({
                "success": True,
                "bookingId": old_appt.id,
                "meetLink": proxy_link
            })
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class PatientOneClickRescheduleView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        appt_id = request.query_params.get("id")
        date_str = request.query_params.get("date")
        time_str = request.query_params.get("time")

        try:
            appt = Appointment.objects.get(id=appt_id)
            
            # Check for conflict
            tz = timezone.get_current_timezone()
            naive_dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %I:%M %p")
            new_date_time = timezone.make_aware(naive_dt, tz)

            if Appointment.objects.filter(date_time=new_date_time).exclude(id=appt_id, status="cancelled").exists():
                return HttpResponse(f"<html><body><h1>Slot no longer available</h1><p>Sorry, {date_str} at {time_str} was just booked. Please check your original email for more slots.</p></body></html>")

            # Update the appointment
            appt.date_time = new_date_time
            appt.status = "scheduled"  # reset from cancelled or pending
            appt.payment_status = "paid" # ensure it stays paid
            appt.save()

            # Notify Admin
            AdminNotification.objects.create(
                message=f"✅ {appt.patient_name} has rescheduled their cancelled appointment to {new_date_time.strftime('%d %b %I:%M %p')}"
            )

            # Send Confirmation Mail
            recipient_email = appt.patient_email or (appt.patient.email if appt.patient else None)
            display_name = appt.patient_name or (appt.patient.username if appt.patient else "Patient")

            if recipient_email:
                proxy_link = request.build_absolute_uri(f"/api/join-meeting/{appt.id}/")
                subject = "✅ Appointment Rescheduled Successfully - Eye Cognizance"
                message = (
                    f"Dear {display_name},\n\n"
                    f"Your appointment has been successfully rescheduled.\n\n"
                    f"New Details:\n"
                    f"  Date     : {new_date_time.strftime('%d %b %Y')}\n"
                    f"  Time     : {time_str}\n"
                    f"  Link     : {proxy_link}\n\n"
                    f"Please note: This link will only activate exactly 5 minutes before the meeting starts.\n\n"
                    f"Regards,\n"
                    f"Eye Cognizance Clinic"
                )
                try:
                    send_mail(subject, message, settings.EMAIL_HOST_USER, [recipient_email], fail_silently=False)
                except Exception as e:
                    print(f"One-Click Confirm Email Error: {e}")

                # Schedule reminder
                schedule_reminder(appt, recipient_email, request)

            return HttpResponse(f"""
                <html>
                    <head>
                        <title>Success - Eye Cognizance</title>
                        <style>
                            body {{ font-family: 'Segoe UI', Arial, sans-serif; text-align: center; padding-top: 100px; background: #f0fdf4; color: #166534; }}
                            .card {{ background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); display: inline-block; max-width: 400px; }}
                            h1 {{ margin-bottom: 10px; }}
                            p {{ color: #4b5563; line-height: 1.6; }}
                        </style>
                    </head>
                    <body>
                        <div class="card">
                            <h1>✅ Rescheduled!</h1>
                            <p>Your appointment has been changed to:<br/><b>{new_date_time.strftime('%d %b %Y')} at {time_str}</b>.</p>
                            <p>A confirmation email has been sent to your inbox. You may close this tab now.</p>
                        </div>
                    </body>
                </html>
            """)
        except Exception as e:
            return HttpResponse(f"<html><body><h1>Something went wrong</h1><p>{str(e)}</p></body></html>")



class AdminLeaveTodayView(APIView):
    authentication_classes = []  # Bypass token validation
    permission_classes = [AllowAny]

    def post(self, request):
        now = timezone.now()

        # Accept optional date param; default to today
        date_param = request.data.get("date") or request.GET.get("date")
        if date_param:
            try:
                from datetime import datetime as dt
                leave_date_local = dt.strptime(date_param, "%Y-%m-%d").date()
            except ValueError:
                return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=400)
        else:
            leave_date_local = timezone.localtime(now).date()

        today_local = leave_date_local  # alias for rest of the logic below

        # 1. Add doctor leave
        doctor = User.objects.filter(is_staff=True).first()
        if doctor:
            DoctorLeave.objects.get_or_create(
                doctor=doctor, 
                leave_date=today_local,
                defaults={"reason": "Emergency Leave"}
            )

        # 2. Find appointments to cancel (all remaining on that date)
        tz = timezone.get_current_timezone()
        start_of_day = timezone.make_aware(datetime.combine(today_local, time.min), tz)
        end_of_day   = timezone.make_aware(datetime.combine(today_local, time.max), tz)

        appointments = Appointment.objects.filter(
            date_time__range=(start_of_day, end_of_day),
            date_time__gt=now
        ).exclude(status="cancelled")

        # 3. Pre-calculate some available slots for next 3 days
        one_click_base = f"{request.build_absolute_uri('/')[:-1]}/api/patient/one-click-reschedule/"
        refund_base = f"{request.build_absolute_uri('/')[:-1]}/api/patient/reschedule-or-refund/" # though we use frontend page for refund
        
        # Calculate available slots for next 3 days
        available_grid = []
        days_to_check = 0
        test_day = today_local + timedelta(days=1)
        while len(available_grid) < 6 and days_to_check < 5:
            if not DoctorLeave.objects.filter(leave_date=test_day).exists():
                tz = timezone.get_current_timezone()
                start_dt = timezone.make_aware(datetime.combine(test_day, time.min), tz)
                end_dt = timezone.make_aware(datetime.combine(test_day, time.max), tz)
                
                booked = Appointment.objects.filter(date_time__range=(start_dt, end_dt)).exclude(status="cancelled")
                booked_times = [a.date_time.astimezone(tz).strftime("%I:%M %p") for a in booked]
                
                found_today = 0
                for slot in DEFAULT_TIME_SLOTS:
                    if slot not in booked_times:
                        available_grid.append({
                            "date": test_day.strftime("%Y-%m-%d"),
                            "label": f"{test_day.strftime('%d %b')} {slot}",
                            "time": slot
                        })
                        found_today = int(found_today) + 1
                        if found_today >= 2: break
            test_day += timedelta(days=1)
            days_to_check += 1

        cancelled_count = 0
        for appt in appointments:
            appt.status = "cancelled"
            appt.save()
            cancelled_count += 1

            recipient_email = appt.patient_email or (appt.patient.email if appt.patient else None)
            display_name = appt.patient_name or (appt.patient.username if appt.patient else "Patient")

            if recipient_email:
                # Build HTML list of slots
                slot_html = ""
                for slot in available_grid:
                    link = f"{one_click_base}?id={appt.id}&date={slot['date']}&time={slot['time']}"
                    slot_html += f'<li><a href="{link}" style="display:inline-block; padding:8px 15px; margin:5px; background-color:#6A8E4F; color:white; text-decoration:none; border-radius:5px; font-weight:bold;">{slot["label"]}</a></li>'

                # Full page link if they want more dates
                full_resched_url = f"http://localhost:5173/reschedule-or-refund/{appt.id}?action=reschedule"
                refund_url = f"http://localhost:5173/reschedule-or-refund/{appt.id}?action=cancel"

                subject = "🚨 Emergency Update: Your Appointment at Eye Cognizance"
                
                # HTML Message
                message_html = f"""
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
                    <h2 style="color: #c00;">Emergency Leave Notification</h2>
                    <p>Dear {display_name},</p>
                    <p>Due to an emergency, the doctor had to take leave today. Your appointment has been cancelled.</p>
                    
                    <h3 style="color: #6A8E4F;">Option 1: Pick a New Slot Instantly (FREE)</h3>
                    <p>Click any slot below to reschedule for free right now:</p>
                    <ul style="list-style: none; padding: 0;">
                        {slot_html}
                    </ul>

                    <h3 style="color: #d33;">Option 2: Cancel completely</h3>
                    <p>If you prefer a full refund, click here: <br/> 
                    <a href="{refund_url}" style="color: #d33; font-weight: bold;">Request Full Refund</a></p>
                    
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p>Eye Cognizance Clinic</p>
                </div>
                """
                
                # Non-HTML fallback
                message_plain = (
                    f"Dear {display_name},\n\n"
                    f"The doctor is on emergency leave today. Your appointment is cancelled.\n\n"
                    f"Please check this email in HTML mode to click a new slot.\n"
                    f"To request a refund, visit: {refund_url}\n\n"
                    f"Eye Cognizance Clinic"
                )

                try:
                    email = EmailMultiAlternatives(subject, message_plain, settings.EMAIL_HOST_USER, [recipient_email])
                    email.attach_alternative(message_html, "text/html")
                    email.send()
                    print(f"One-click leave mail sent to {recipient_email}")
                except Exception as e:
                    print(f"Leave Email Error: {e}")

        return Response({
            "success": True,
            "message": f"Leave set. {cancelled_count} notifications sent with one-click slots.",
            "cancelled": cancelled_count
        })

    def get(self, request):
        date_str = request.query_params.get("date")
        if date_str:
            try:
                from datetime import datetime as dt
                selected_date = dt.strptime(date_str, "%Y-%m-%d").date()
                is_leave = DoctorLeave.objects.filter(leave_date=selected_date).exists()
                return Response({"is_leave": is_leave})
            except ValueError:
                return Response({"error": "Invalid date format"}, status=400)
        
        # If no date specified, return ALL upcoming leaves
        leaves = DoctorLeave.objects.filter(leave_date__gte=timezone.now().date()).order_by("leave_date")
        data = [{"id": l.id, "date": l.leave_date.strftime("%Y-%m-%d")} for l in leaves]
        return Response(data)

    def delete(self, request):
        date_str = request.query_params.get("date")
        if not date_str:
            return Response({"error": "Date required"}, status=400)
        
        try:
            from datetime import datetime as dt
            selected_date = dt.strptime(date_str, "%Y-%m-%d").date()
            DoctorLeave.objects.filter(leave_date=selected_date).delete()
            return Response({"success": True, "message": f"Leave removed for {date_str}"})
        except ValueError:
            return Response({"error": "Invalid date format"}, status=400)

class UserConsultationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        appointments = Appointment.objects.filter(patient=user).select_related("patient", "doctor").order_by("-date_time")

        now = timezone.now()
        data = []
        for appt in appointments:
            display_name = appt.patient_name or (getattr(appt.patient, "username", "N/A") if appt.patient else "N/A")

            data.append({
                "id": appt.id,
                "patient_name": display_name,
                "doctor_name": "Maimunissa",
                "consultation_type": appt.consultation_type or "video",
                "date_time": appt.date_time.isoformat() if appt.date_time else None,
                "status": appt.computed_status,
                "payment_status": appt.payment_status,
                "amount": appt.amount,
                "patient_dob": appt.patient_dob,
                "meeting_link": request.build_absolute_uri(f"/api/join-meeting/{appt.id}/") if not appt.meeting_expired else None,
                "meeting_expired": appt.meeting_expired,
            })

        return Response(data)

class UserConsultationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            appt = Appointment.objects.get(id=pk, patient=request.user)
            now = timezone.now()
            appt_dt = appt.date_time
            if appt_dt and timezone.is_naive(appt_dt):
                appt_dt = timezone.make_aware(appt_dt)
            
            if appt.status == "cancelled":
                status_value = "cancelled"
            elif appt_dt and (appt_dt + timedelta(minutes=30)) <= now:
                status_value = "completed"
            else:
                status_value = "scheduled"

            display_name = appt.patient_name or (appt.patient.username if appt.patient else "N/A")

            return Response({
                "patient_name": display_name,
                "doctor_name": "Maimunissa",
                "consultation_type": appt.consultation_type or "video",
                "date_time": appt.date_time.isoformat() if appt.date_time else None,
                "status": appt.computed_status,
                "patient_dob": appt.patient_dob,
                "meeting_link": request.build_absolute_uri(f"/api/join-meeting/{appt.id}/") if not appt.meeting_expired else None,
                "meeting_expired": appt.meeting_expired,
            })
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)

    def delete(self, request, pk):
        try:
            appt = Appointment.objects.get(id=pk, patient=request.user)

            # ── Fetch payment method details from Razorpay ──────────────────
            refund_destination = "your original payment method"
            if appt.razorpay_payment_id:
                try:
                    payment_data = client.payment.fetch(appt.razorpay_payment_id)
                    method = payment_data.get("method", "")

                    if method == "upi":
                        vpa = payment_data.get("vpa", "")
                        refund_destination = f"UPI ID: {vpa}" if vpa else "UPI account"

                    elif method == "card":
                        card = payment_data.get("card", {}) or {}
                        network = card.get("network", "Card")
                        last4  = card.get("last4", "****")
                        refund_destination = f"{network} card ending in {last4}"

                    elif method == "netbanking":
                        bank = payment_data.get("bank", "your bank")
                        refund_destination = f"Net Banking – {bank}"

                    elif method == "wallet":
                        wallet = payment_data.get("wallet", "your wallet")
                        refund_destination = f"Wallet: {wallet}"

                    else:
                        refund_destination = method if method else "your original payment method"

                    print(f"Payment method detected: {method} → {refund_destination}")
                except Exception as e:
                    print("Could not fetch payment details:", e)

                # ── Initiate the actual refund ───────────────────────────────
                try:
                    client.payment.refund(appt.razorpay_payment_id, {
                        "amount": int(float(appt.amount) * 100)
                    })
                    print(f"Refund initiated for payment {appt.razorpay_payment_id}")
                except Exception as e:
                    print("User Cancel Refund error:", e)

            # ── Prepare info ─────────────────────────────────────────────────
            display_name    = appt.patient_name or (appt.patient.username if appt.patient else "A patient")
            # Prefer the email collected during booking
            patient_email   = appt.patient_email or (getattr(appt.patient, 'email', None))
            appt_time_str   = timezone.localtime(appt.date_time).strftime('%d %b %Y %I:%M %p') if appt.date_time else "N/A"

            # ── Admin in-app notification ────────────────────────────────────
            AdminNotification.objects.create(
                message=f"\U0001f6d1 {display_name} has cancelled their appointment on {appt_time_str}. Refund → {refund_destination}."
            )

            # ── Email to Admin ───────────────────────────────────────────────
            try:
                send_mail(
                    subject=f"[Eye Cognizance] Appointment Cancelled: {display_name}",
                    message=(
                        f"Patient {display_name} has cancelled their appointment.\n"
                        f"Appointment Date/Time : {appt_time_str}\n"
                        f"Refund initiated to   : {refund_destination}"
                    ),
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=False,
                )
                print(f"Admin notified of cancellation by {display_name}")
            except Exception as e:
                print("Admin cancellation email error:", e)

            # ── Refund confirmation email to Patient ─────────────────────────
            if patient_email:
                try:
                    send_mail(
                        subject="Appointment Cancelled & Refund Initiated \u2013 Eye Cognizance",
                        message=(
                            f"Dear {display_name},\n\n"
                            f"Your appointment on {appt_time_str} has been successfully cancelled.\n\n"
                            f"Refund Details:\n"
                            f"  Amount     : Rs. {appt.amount}\n"
                            f"  Refund To  : {refund_destination}\n"
                            f"  Expected   : Within 3-5 business days\n\n"
                            f"We hope to see you again.\n\n"
                            f"Regards,\n"
                            f"Eye Cognizance Clinic"
                        ),
                        from_email=settings.EMAIL_HOST_USER,
                        recipient_list=[patient_email],
                        fail_silently=False,
                    )
                    print(f"Patient refund email sent to {patient_email}")
                except Exception as e:
                    print("Patient cancellation email error:", e)
            appt.status = "cancelled"
            appt.payment_status = "refunded"
            appt.save()
            return Response({
                "success": True,
                "message": f"Appointment cancelled. A refund of Rs. {appt.amount} has been initiated to {refund_destination}."
            })
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=404)


# USER: send contact message
@api_view(['POST'])
@permission_classes([AllowAny])
def contact_message_create(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True, "message": "Message sent successfully"})
    return Response(serializer.errors, status=400)

# ADMIN: get all contact messages
@api_view(['GET'])
@permission_classes([AllowAny])  # Allow access for testing (remove in production)
def contact_messages_list(request):
    messages = ContactMessage.objects.all().order_by('-created_at')
    serializer = ContactMessageSerializer(messages, many=True)
    return Response(serializer.data)



class UserConsultations(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        appointments = Appointment.objects.filter(patient=request.user)

        data = []
        for appt in appointments:
            display_name = appt.patient_name or appt.patient.username
            data.append({
                "id": appt.id,
                "patient_name": display_name,
                "doctor_name": "Maimunissa",
                "consultation_type": appt.consultation_type,
                "date_time": appt.date_time,
                "payment_status": appt.payment_status,
                "amount": appt.amount,
                "meeting_link": appt.meeting_link,
                "status": appt.computed_status if hasattr(appt, 'computed_status') else "scheduled"
            })

        return Response(data)


# ADMIN: get unread notifications
@api_view(['GET'])
@permission_classes([AllowAny])
def admin_notifications_list(request):
    notifications = AdminNotification.objects.filter(is_read=False).order_by('-created_at')
    data = [
        {
            "id": n.id,
            "message": n.message,
            "created_at": n.created_at.isoformat(),
        }
        for n in notifications
    ]
    return Response(data)


# ADMIN: mark all notifications as read
@api_view(['POST'])
@permission_classes([AllowAny])
def admin_notifications_mark_read(request):
    AdminNotification.objects.filter(is_read=False).update(is_read=True)
    return Response({"success": True})
