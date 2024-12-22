from rest_framework import serializers

from .models import Employee, WorkEntry


class WorkEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkEntry
        fields = "__all__"
        read_only_fields = ["is_paid", "payment_date"]

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


class EmployeeeSerializer(serializers.ModelSerializer):
    hire_date = serializers.DateField(read_only=True)
    work_entry = WorkEntrySerializer(many=True, read_only=True)

    class Meta:
        model = Employee
        fields = "__all__"
