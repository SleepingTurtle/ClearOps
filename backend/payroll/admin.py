from django.contrib import admin

from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        "first_name",
        "last_name",
        "worker_type",
        "is_active",
        "date_joined",
    )
    list_filter = ("worker_type", "is_active")
    search_fields = ("first_name", "last_name")
