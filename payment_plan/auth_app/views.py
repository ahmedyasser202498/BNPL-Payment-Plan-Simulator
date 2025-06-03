from django.shortcuts import render

from rest_framework import viewsets, status,generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.hashers import make_password

from auth_app.models import User
from auth_app.serializers import SignupSerializer

class RoleView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        role='user'
        if request.user.is_merchant:
            role='merchant'
        return Response({'role':role}, status=status.HTTP_200_OK)


class SignupView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User registered successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)