from django.utils import timezone
from datetime import timedelta
from .models import Appointment
from .emails import send_meeting_email

def send_meeting_reminders():
    now = timezone.now()
    target = now + timedelta(minutes=5)

    appointments = Appointment.objects.filter(
        date_time__range=(now, target),
        meeting_link__isnull=False
    )

    for appt in appointments:
        send_meeting_email(appt)
