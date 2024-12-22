from django.db import models


class Employee(models.Model):
    WORKER_TYPE_CHOICES = [
        ("hourly", "Hourly"),
        ("daily", "Daily"),
    ]

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    worker_type = models.CharField(
        max_length=10, choices=WORKER_TYPE_CHOICES, default="hourly"
    )
    hourly_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    daily_rate = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    is_active = models.BooleanField(default=True)
    hire_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
