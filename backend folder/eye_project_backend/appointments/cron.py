from django.utils import timezone
from datetime import timedelta
from .models import Appointment
from .emails import send_meeting_email

def send_meeting_reminders():
    now = timezone.now()
    target = now + timedelta(minutes=5)

    appointments = Appointment.objects.filter(
        start_datetime__range=(now, target),
        meet_link__isnull=False
    )

    for appt in appointments:
        send_meeting_email(appt)
