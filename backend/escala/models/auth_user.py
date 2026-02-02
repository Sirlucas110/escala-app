from django.contrib.auth.models import AbstractUser
from django.db.models import EmailField


class AuthUser(AbstractUser):
    email = EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
