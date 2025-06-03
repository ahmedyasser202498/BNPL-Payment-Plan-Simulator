from django.shortcuts import render

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import PaymentPlan, Installment
from crm_app.serializers import PaymentPlanInputSerializer,PaymentPlanOutputSerializer, InstallmentSerializer,PlanIdSerializer
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from crm_app.services import PaymentServices
from django.core.exceptions import ValidationError
from auth_app.permissions import IsPlanUser,IsInstallmentUser,IsOwner

class PaymentPlanView(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated,IsPlanUser]


    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return PaymentPlanOutputSerializer
        return PaymentPlanInputSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_merchant:
            return PaymentPlan.objects.filter(merchant=user)
        return PaymentPlan.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        serializer = PaymentPlanInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = PaymentServices.create_payment_plan_with_installments(**serializer.validated_data, merchant=request.user)
        output_serializer = PaymentPlanOutputSerializer(plan)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)



class InstallmentView(viewsets.ModelViewSet):
    serializer_class = InstallmentSerializer
    permission_classes = [IsAuthenticated,IsInstallmentUser,IsOwner]
    queryset = Installment.objects.all()

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        installment = self.get_object()
        try:
            PaymentServices.pay_installment(installment)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"status": "Paid successfully"}, status=status.HTTP_201_CREATED)