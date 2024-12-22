from django.db import models
from django.utils import timezone


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


class WorkEntry(models.Model):
    PAYMENT_TYPE_CHOICES = [
        ("cash", "Cash"),
        ("bank_transfer", "Bank Transfer"),
        ("check", "Check"),
    ]
    employee = models.ForeignKey(
        Employee, on_delete=models.CASCADE, related_name="work_entries"
    )
    payroll_period_start = models.DateField()
    payroll_period_end = models.DateField()
    hours_worked = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    days_worked = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    is_paid = models.BooleanField(default=False)
    payment_type = models.CharField(
        max_length=20, null=True, blank=True, choices=PAYMENT_TYPE_CHOICES
    )
    payment_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("employee", "payroll_period_start", "payroll_period_end")
        ordering = ["-payroll_period_start"]

    def __str__(self):
        return f"WorkEntry for {self.employee} from {self.payroll_period_start} to {self.payroll_period_end}"
