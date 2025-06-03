# services/payment_plan_services.py

from django.core.exceptions import ValidationError
from datetime import timedelta,date

from crm_app.models import PaymentPlan, Installment
from crm_app.choices import PaymentStatus
from decimal import Decimal
from auth_app.models import User
from dateutil.relativedelta import relativedelta
from calendar import monthrange

class PaymentServices:

    def create_payment_plan_with_installments(total_amount:Decimal,user_email:str,number_of_installments:int,start_date:date, merchant):
        
        customer_user= User.objects.get(email=user_email)
        plan = PaymentPlan.objects.create(
            merchant=merchant,
            user=customer_user,
            total_amount=total_amount,
            number_of_installments=number_of_installments,
            start_date=start_date
            )
        installment_amount = round(total_amount/ number_of_installments, 2)
        
        for i in range(number_of_installments):
            target_day = start_date.day
            next_month = start_date + relativedelta(months=i)

            # Get last day of the target month
            last_day = monthrange(next_month.year, next_month.month)[1]
            due_day = min(target_day, last_day)

            due_date = next_month.replace(day=due_day)

            status=PaymentStatus.DUE
            if due_date < date.today():
                status=PaymentStatus.NOTPAIDANDLATE
            elif due_date > date.today():
                status=PaymentStatus.NOTDUEYET
            

            Installment.objects.create(
                period=i + 1,
                plan=plan,
                amount=installment_amount,
                due_date=due_date,
                status=status
            )
        return plan



    def pay_installment(installment: Installment):
        if installment.status in (PaymentStatus.PAIDONTIME,PaymentStatus.PAIDEARLY,PaymentStatus.PAIDLATE):
            raise ValidationError("Installment already paid.")

        if date.today() < installment.due_date:
            installment.status = PaymentStatus.PAIDEARLY
        elif date.today() > installment.due_date:
            installment.status = PaymentStatus.PAIDLATE
        else:
            installment.status = PaymentStatus.PAIDONTIME

        installment.save()
        return installment