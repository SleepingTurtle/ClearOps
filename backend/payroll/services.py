# clearops/backend/payroll/services.py
from django.db import transaction
from decimal import Decimal
from django.utils import timezone

from .models import Employee, WorkEntry, PayrollRun


def calculate_payroll(
    payroll_period_start, payroll_period_end, payroll_run: PayrollRun
):
    """
    Processes payroll for all active employees within the specified payroll period.
    """
    # Fetch all active employees
    employees = Employee.objects.filter(is_active=True)

    payroll_results = []

    for employee in employees:
        # Fetch WorkEntrys for the employee within the payroll period
        WorkEntrys = WorkEntry.objects.filter(
            employee=employee,
            payroll_period_start=payroll_period_start,
            payroll_period_end=payroll_period_end,
        )

        total_hours = Decimal("0.00")
        total_days = Decimal("0.00")

        for we in WorkEntrys:
            if employee.worker_type == "hourly":
                total_hours += we.hours_worked or 0
            elif employee.worker_type == "daily":
                total_days += we.days_worked or 0

        # Calculate gross pay
        if employee.worker_type == "hourly":
            gross_pay = total_hours * employee.hourly_rate
        elif employee.worker_type == "daily":
            gross_pay = total_days * employee.daily_rate
        else:
            gross_pay = Decimal("0.00")

        # Here, you can add logic for deductions, taxes, etc.
        # For simplicity, we'll assume net_pay = gross_pay

        net_pay = gross_pay  # Placeholder for actual deduction logic

        # Update WorkEntrys as paid
        with transaction.atomic():
            WorkEntrys.update(
                is_paid=True,
                payment_type="bank_transfer",
                payment_date=timezone.now().date(),
                payroll_run=payroll_run,
            )

        # Append the result
        payroll_results.append(
            {
                "employee_id": employee.id,
                "employee_name": f"{employee.first_name} {employee.last_name}",
                "gross_pay": gross_pay,
                "net_pay": net_pay,
                "payment_type": "bank_transfer",
                "payment_date": timezone.now().date(),
                "payroll_run": payroll_run.id,
            }
        )

    return payroll_results
