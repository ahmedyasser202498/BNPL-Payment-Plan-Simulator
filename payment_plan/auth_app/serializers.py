from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from auth_app.models import User

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)
    is_merchant = serializers.BooleanField(required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'is_merchant']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data,username=validated_data['email'])
        user.set_password(password)
        user.save()
        return user
