import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'eye_project_backend.settings')
django.setup()

from appointments.models import Appointment, Patient

def link_patients():
    print("Linking patients to owners...")
    appointments = Appointment.objects.filter(patient__isnull=False)
    for appt in appointments:
        provided_name = appt.patient_name or appt.patient.username
        provided_email = appt.patient_email or appt.patient.email
        provided_mobile = appt.patient_mobile or appt.patient.mobile

        if not provided_name or not provided_email or not provided_mobile:
            print(f"Skipping appointment {appt.id} due to missing patient data")
            continue

        # Get or create patient based on name, email, mobile in appointment
        patient_obj, created = Patient.objects.get_or_create(
            name=provided_name,
            email=provided_email,
            mobile=provided_mobile,
            defaults={
                'owner': appt.patient,
                'dob': appt.patient_dob,
                'gender': appt.patient_gender
            }
        )
        if not patient_obj.owner:
            patient_obj.owner = appt.patient
            patient_obj.save()
            print(f"Linked patient {patient_obj.name} to owner {appt.patient.email}")
    print("Done.")

if __name__ == "__main__":
    link_patients()
