from django.db import models
from django.db.models import Sum

from crm_app.choices import PaymentStatus,PlantStatus
from auth_app.models import User

class TimeStampMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=True,blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True,blank=True)

    class Meta:
        abstract = True


class PaymentPlan(TimeStampMixin):
    merchant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='merchant_plans')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_plans')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    number_of_installments = models.PositiveIntegerField()
    start_date = models.DateField()
    status = models.IntegerField(choices=PlantStatus.choices,default=PlantStatus.ACTIVE)

    def __str__(self):
        return f"Plan #{self.id} for {self.user.email}"

    @property
    def paid_installments(self) -> int:
        return Installment.objects.filter(plan_id=self.id,status__in=(PaymentStatus.PAIDEARLY,PaymentStatus.PAIDLATE,PaymentStatus.PAIDONTIME)).count()
    @property
    def paid_installments_amount(self) -> int:
        sum= Installment.objects.filter(plan_id=self.id,status__in=(PaymentStatus.PAIDEARLY,PaymentStatus.PAIDLATE,PaymentStatus.PAIDONTIME)).aggregate(total=Sum("amount"))["total"]
        return sum if sum else 0
    

class Installment(TimeStampMixin):
    period = models.PositiveIntegerField()
    plan = models.ForeignKey(PaymentPlan, on_delete=models.CASCADE, related_name='installments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateField()
    status = models.IntegerField(choices=PaymentStatus.choices,default=PaymentStatus.NOTDUEYET)

    def __str__(self):
        return f"Installment #{self.period} for Plan #{self.plan.id} - {self.get_status_display()}"