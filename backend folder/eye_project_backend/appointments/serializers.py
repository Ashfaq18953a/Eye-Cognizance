from rest_framework import serializers
from .models import Appointment, SystemSettings,ContactMessage 
from authentication.models import User
from rest_framework import serializers
from .models import ContactMessage

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"



class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    patient_email = serializers.CharField(source='patient.email', read_only=True)
    patient_mobile = serializers.CharField(source='patient.mobile', read_only=True)
    doctor_name = serializers.CharField(source='doctor.username', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'




class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = ["id", "locked_slots"]



class AdminAppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.username', read_only=True)
    patient_email = serializers.CharField(source='patient.email', read_only=True)
    patient_mobile = serializers.CharField(source='patient.mobile', read_only=True)
    doctor_name = serializers.CharField(source='doctor.username', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            "id",
            "patient_name",
            "patient_email",
            "patient_mobile",
            "doctor_name",
            "consultation_type",
            "date_time",
            "status",
            "payment_status",
            "meeting_link",
            "patient_dob",
        ]


