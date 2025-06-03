from django.db.models.signals import post_save
from django.dispatch import receiver
from crm_app.models import Installment, PaymentPlan
from crm_app.choices import PaymentStatus,PlantStatus

@receiver(post_save, sender=Installment)
def update_plan_status(sender, instance, **kwargs):
    plan = instance.plan
    if all(inst.status in (PaymentStatus.PAIDONTIME,PaymentStatus.PAIDEARLY,PaymentStatus.PAIDLATE) for inst in plan.installments.all()):
        plan.status = PlantStatus.SETTLED
        plan.save()
