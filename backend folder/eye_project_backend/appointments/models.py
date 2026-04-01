
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta, time

class Patient(models.Model):
    name = models.CharField(max_length=150)
    email = models.EmailField()
    mobile = models.CharField(max_length=20)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], null=True, blank=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="owned_patients", null=True, blank=True)

    def __str__(self):
        return f"{self.name} ({self.email}, {self.mobile})"


class SystemSettings(models.Model):
    site_name = models.CharField(max_length=100, default="Eye Cognizance")
    consultation_price = models.FloatField(default=500)
    slot_duration_minutes = models.IntegerField(default=30)
    video_enabled = models.BooleanField(default=True)
    maintenance_mode = models.BooleanField(default=False)
    locked_slots = models.JSONField(default=dict, blank=True)
    custom_time_ranges = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return "System Settings"


class DoctorLeave(models.Model):
    doctor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    leave_date = models.DateField()
    reason = models.TextField(blank=True, null=True)


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class AdminNotification(models.Model):
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{'[READ] ' if self.is_read else ''}{self.message[:60]}"


class Appointment(models.Model):
    patient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="appointments"
    )

    patient_name = models.CharField(
        max_length=150,
        null=True,
        blank=True,
        help_text="Name of the actual patient for this appointment"
    )

    patient_email = models.EmailField(
        null=True,
        blank=True,
        help_text="Email of the patient entered during booking"
    )

    patient_mobile = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        help_text="Mobile number of the patient entered during booking"
    )

    patient_dob = models.DateField(
        null=True,
        blank=True,
        help_text="Date of birth of the patient"
    )

    patient_gender = models.CharField(
        max_length=10,
        choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')],
        null=True,
        blank=True,
        help_text="Gender of the patient"
    )

    doctor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="doctor_appointments"
    )

    consultation_type = models.CharField(
        max_length=20,
        choices=[
            ('video', 'Video'),
            ('audio', 'Audio'),
            ('message', 'Message')
        ]
    )

    date_time = models.DateTimeField()

    payment_status = models.CharField(
        max_length=20,
        default='pending'
    )

    status = models.CharField(
        max_length=20,
        default="scheduled"  # ⚡ Add default to satisfy NOT NULL
    )

    amount = models.IntegerField(default=0)

    razorpay_payment_id = models.CharField(
        max_length=100,
        null=True,
        blank=True
    )

    meeting_link = models.URLField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def computed_status(self):
        """
        Calculates the current status of the appointment based on current time.
        """
        now = timezone.now()
        start = self.date_time
        # Duration is 30 mins by default
        end = start + timedelta(minutes=30)

        if self.status == "cancelled":
            return "Cancelled"
        
        if self.payment_status != "paid":
            return "Payment Pending"

        if now < start:
            return "Upcoming"
        elif start <= now < end:
            return "Ongoing"
        return "Completed"

    @property
    def meeting_active(self):
        return self.computed_status == "Ongoing"

    @property
    def meeting_expired(self):
        """Returns True if the appointment time (+ 30m duration) has passed."""
        now = timezone.now()
        end_time = self.date_time + timedelta(minutes=30)
        return now >= end_time

    def __str__(self):
        return f"{self.patient_name or self.patient} with {self.doctor} on {self.date_time}"


class Testimonial(models.Model):
    name = models.CharField(max_length=150)
    location = models.CharField(max_length=150)
    rating = models.IntegerField(default=5)
    review = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.location}"


