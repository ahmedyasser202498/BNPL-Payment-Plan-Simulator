# serializers.py

from rest_framework import serializers
from .models import PaymentPlan, Installment, User
from django.utils import timezone
from datetime import timedelta

class InstallmentSerializer(serializers.ModelSerializer):

    status=serializers.SerializerMethodField()

    def get_status(self, obj):
        return obj.get_status_display()
    
    class Meta:
        model = Installment
        fields = '__all__'
        read_only_fields = ['status']

class PaymentPlanInputSerializer(serializers.Serializer):

    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2,required=True, allow_null=False)
    user_email = serializers.CharField(required=True, allow_null=False, allow_blank=False)
    number_of_installments = serializers.IntegerField(required=True, allow_null=False)
    start_date = serializers.DateField(required=True)
    

    class Meta:
        model = PaymentPlan

    def validate(self, data):
        if data['number_of_installments'] <= 0:
            raise serializers.ValidationError("Number of installments must be > 0.")
        
        user= User.objects.filter(email=data['user_email'])
        if not user:
            raise serializers.ValidationError("There is no user with that email")
        
        if user.first().is_merchant:
            raise serializers.ValidationError("Can not create plan with merchant user")
        return data
    
class PaymentPlanOutputSerializer(serializers.ModelSerializer):

    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    user_email = serializers.SerializerMethodField()
    number_of_installments = serializers.IntegerField()
    number_of_paid_installments = serializers.SerializerMethodField()
    start_date = serializers.DateField()
    status = serializers.SerializerMethodField()
    installments = InstallmentSerializer(many=True, read_only=True)
    total_paid_amount = serializers.SerializerMethodField()
    
    def get_user_email(self, obj):
        return obj.user.email

    def get_number_of_paid_installments(self, obj):
        return obj.paid_installments
    
    def get_status(self, obj):
        return obj.get_status_display()
    
    def get_total_paid_amount(self,obj):
        return obj.paid_installments_amount
    
    class Meta:
        model = PaymentPlan
        fields = ['id','total_amount', 'user_email', 'number_of_installments', 'number_of_paid_installments', 'start_date', 'status','installments', 'total_paid_amount']

class PlanIdSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField(required=True)