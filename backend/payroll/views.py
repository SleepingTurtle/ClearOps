from datetime import datetime
from rest_framework import viewsets, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .services import calculate_payroll
from .models import Employee, WorkEntry, PayrollRun
from .serializers import EmployeeSerializer, WorkEntrySerializer, PayrollRunSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    search_fields = ["first_name", "last_name"]
    filterset_fields = ["worker_type", "is_active", "date_joined"]
    ordering_fields = ["first_name", "last_name", "hourly_rate", "date_joined"]
    ordering = ["-date_joined"]


class WorkEntryViewSet(viewsets.ModelViewSet):
    queryset = WorkEntry.objects.all()
    serializer_class = WorkEntrySerializer
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["employee__first_name", "employee__last_name"]
    filterset_fields = ["employee", "is_paid", "payment_type", "payroll_period_start"]
    ordering_fields = ["payroll_period_start", "payroll_period_end", "payment_date"]
    ordering = ["-payroll_period_start"]


class PayrollProcessView(APIView):
    """
    API endpoint to process payroll for a specified period.
    """

    # permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Expects JSON with 'payroll_period_start' and 'payroll_period_end' in 'YYYY-MM-DD' format.
        """
        payroll_period_start = request.data.get("payroll_period_start")
        payroll_period_end = request.data.get("payroll_period_end")

        if not payroll_period_start or not payroll_period_end:
            return Response(
                {
                    "error": "Both 'payroll_period_start' and 'payroll_period_end' are required."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payroll_period_start = datetime.strptime(
                payroll_period_start, "%Y-%m-%d"
            ).date()
            payroll_period_end = datetime.strptime(
                payroll_period_end, "%Y-%m-%d"
            ).date()
        except ValueError:
            return Response(
                {"error": "Dates must be in 'YYYY-MM-DD' format."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if payroll_period_end < payroll_period_start:
            return Response(
                {"error": "'payroll_period_end' must be after 'payroll_period_start'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payroll_run = PayrollRun.objects.create(
            payroll_period_start=payroll_period_start,
            payroll_period_end=payroll_period_end,
            notes="Payroll processed via API.",
        )

        payroll_results = calculate_payroll(
            payroll_period_start, payroll_period_end, payroll_run
        )

        return Response(
            {"message": "Payroll processed successfully.", "payroll": payroll_results},
            status=status.HTTP_200_OK,
        )


class PayrollRunViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions for PayrollRun
    """

    queryset = PayrollRun.objects.prefetch_related("work_entries__employee")
    serializer_class = PayrollRunSerializer
    # permission_classes = [IsAuthenticated]
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["payroll_period_start", "payroll_period_end"]
    filterset_fields = ["payroll_period_start", "payroll_period_end", "date_processed"]
    ordering_fields = ["payroll_period_start", "payroll_period_end", "date_processed"]
    ordering = ["-date_processed"]
