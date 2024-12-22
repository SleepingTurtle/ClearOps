from rest_framework import serializers

from .models import Employee


class EmployeeeSerializer(serializers.ModelSerializer):
    hire_date = serializers.DateField(read_only=True)

    class Meta:
        model = Employee
        fields = "__all__"
