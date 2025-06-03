from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError


class User(AbstractUser):

    is_merchant = models.BooleanField(default=False)
    email = models.EmailField(unique=True)

    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']


    @property
    def full_name(self):
        return self.get_full_name()

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
