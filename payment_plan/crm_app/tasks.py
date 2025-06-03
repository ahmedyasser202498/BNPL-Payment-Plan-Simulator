from celery import shared_task
from django.core.mail import send_mail
from django.utils.timezone import now
from datetime import timedelta

from crm_app.models import Installment

@shared_task
def send_payment_reminders():
    due_date = now().date() + timedelta(days=3)
    intallments = Installment.objects.filter(due_date=due_date)

    for installment in intallments:
        send_mail(
            subject="Installment Reminder",
            message=f"Hi {installment.plan.user.email}, your installment of {installment.amount} is due in 3 days.",
            from_email=None,
            recipient_list=[installment.plan.user.email],
        )
