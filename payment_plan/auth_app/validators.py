
import re
from django.core.exceptions import ValidationError


def validate_phone(phone_number):
    match = re.match('01[0-9]{9}', phone_number)
    if match is None or len(phone_number) != 11:
        raise ValidationError(_('Invalid Phone Number'))