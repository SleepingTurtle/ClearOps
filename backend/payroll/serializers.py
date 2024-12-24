from rest_framework import serializers

from .models import Employee, WorkEntry, PayrollRun


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"


class WorkEntrySerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)
    employee_id = serializers.PrimaryKeyRelatedField(
        queryset=Employee.objects.filter(is_active=True),
        source="employee",
        write_only=True,
    )

    class Meta:
        model = WorkEntry
        fields = [
            "id",
            "employee",
            "employee_id",
            "payroll_run",
            "payroll_period_start",
            "payroll_period_end",
            "hours_worked",
            "days_worked",
            "is_paid",
            "payment_type",
            "payment_date",
            "notes",
            "gross_pay",
            "total_deductions",
            "net_pay",
        ]
        read_only_fields = [
            "is_paid",
            "payment_date",
            "payment_type",
            "notes",
            "gross_pay",
            "total_deductions",
            "net_pay",
        ]

    def validation(self, data):
        employee = data.get("employee") or self.instance.employee
        worker_type = employee.worker_type

        if worker_type == "hourly":
            if not data.get("hours_worked"):
                raise serializers.ValidationError(
                    "Hours worked must be provided for hourly employees."
                )
            if data.get("days_worked"):
                raise serializers.ValidationError(
                    "Days worked should not be provided for hourly employees."
                )
        elif worker_type == "daily":
            if not data.get("days_worked"):
                raise serializers.ValidationError(
                    "Days worked must be provided for daily employees."
                )
            if data.get("hours_worked"):
                raise serializers.ValidationError(
                    "Hours worked should not be provided for daily employees."
                )
        else:
            raise serializers.ValidationError("Invalid worker type.")

        if data["payroll_period_end"] < data["payroll_period_start"]:
            raise serializers.ValidationError("Payroll period end must be after start.")

        return data


class PayrollRunSerializer(serializers.ModelSerializer):
    work_entries = WorkEntrySerializer(many=True, read_only=True)

    class Meta:
        model = PayrollRun
        fields = "__all__"
        read_only_fields = ["date_processed", "date_created", "is_closed"]

    def validate(self, data):
        if data["payroll_period_end"] < data["payroll_period_start"]:
            raise serializers.ValidationError(
                "'payroll_period_end' must be after 'payroll_period_start'."
            )
        return data


class PayrollRunCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PayrollRun
        fields = ["id", "payroll_period_start", "payroll_period_end", "notes"]
