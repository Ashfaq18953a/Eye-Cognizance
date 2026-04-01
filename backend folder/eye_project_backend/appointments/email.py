from django.core.mail import send_mail
from django.conf import settings

def send_meeting_email(appointment):
    subject = "Your Doctor Consultation Video Call"
    message = f"""
Hello {appointment.patient_name},

Your video consultation is scheduled.

🕒 Time: {appointment.date_time.strftime('%d %b %Y, %I:%M %p')}
🎥 Join Link: {appointment.meeting_link}

Please join 5 minutes early.

Regards,
Eye Cognizance
"""

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [appointment.patient_email],
        fail_silently=False,
    )
