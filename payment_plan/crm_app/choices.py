from django.db import models

class PaymentStatus(models.IntegerChoices):
    NOTPAIDANDLATE = 0, "Not Paid and Late"
    PAIDONTIME = 1, "Paid On Time"
    PAIDLATE = 2, "Paid Late"
    PAIDEARLY = 3, "Paid Early"
    DUE = 4, "Due"
    NOTDUEYET = 5, "Not Due Yet"


class PlantStatus(models.IntegerChoices):
    PENDING = 0, "Pending"
    ACTIVE = 1, "Active"
    SETTLED = 2, "Settled"