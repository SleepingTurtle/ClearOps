from django.contrib import admin

from .models import Employee, WorkEntry


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "worker_type",
        "is_active",
        "hire_date",
    )
    list_filter = ("worker_type", "is_active")
    search_fields = ("first_name", "last_name")


@admin.register(WorkEntry)
class WorkEntryAdmin(admin.ModelAdmin):
    list_display = (
        "employee",
        "payroll_period_start",
        "payroll_period_end",
        "is_paid",
        "payment_type",
        "payment_date",
    )
    list_filter = (
        "is_paid",
        "payment_type",
        "payroll_period_start",
        "payroll_period_end",
    )
    search_fields = ("employee__first_name", "employee__last_name")
