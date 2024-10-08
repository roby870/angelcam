"""
Customizations to simplify the user management
"""

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager


class CustomUserManager(BaseUserManager):
    """
    Customizes the user manager as we know only the email
    """

    def create_user(self, email, **extra_fields):
        "creates and stores a user"
        if not email:
            raise ValueError("Enter a valid email")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, **extra_fields):
        "creates and stores a superuser"
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, **extra_fields)


class CustomUser(AbstractBaseUser):
    """
    Customizes the user model as we know only the email
    """

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return str(self.email) if self.email else ""
