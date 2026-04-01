from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    mobile = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['name', 'email', 'mobile', 'password', 'confirm_password', 'address']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
            'mobile': {'required': True},
        }

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError("Passwords do not match")
        if not data.get('email'):
            raise serializers.ValidationError("Email is required")
        if not data.get('mobile'):
            raise serializers.ValidationError("Mobile number is required")
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        name = validated_data.pop('name')
        mobile = validated_data.pop('mobile')

        user = User.objects.create_user(
            username=name,
            email=validated_data['email'],
            mobile=mobile,
            password=validated_data['password'],
            address=validated_data.get('address')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'mobile', 'address']

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError("New passwords do not match")
        return data
