from datetime import datetime
from rest_framework import viewsets, filters, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action

from .services import calculate_payroll
from .models import Employee, WorkEntry, PayrollRun
from .serializers import EmployeeSerializer, WorkEntrySerializer, PayrollRunSerializer, PayrollRunCreateSerializer


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


class BulkWorkEntryCreateView(generics.CreateAPIView):
    serializer_class = WorkEntrySerializer
    # permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        work_entries_data = request.data.get("work_entries", [])
        if not isinstance(work_entries_data, list):
            return Response(
                {"error": "work_entries must be a list."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=work_entries_data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serialzier)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class PayrollRunViewSet(viewsets.ModelViewSet):
    """
    A viewset that provides the standard actions for PayrollRun
    """
    queryset = PayrollRun.objects.prefetch_related("work_entries__employee")
    serializer_class = PayrollRunSerializer
    # permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ['create']:
            return PayrollRunCreateSerializer
        return PayrollRunSerializer

    @action(detail=True, methods=["post"])
    def close(self, request, pk=None):
        payroll_run = self.get_object()
        if payroll_run.is_closed:
            return Response({"error": "Payroll run is already closed."}, status=status.HTTP_400_BAD_REQUEST)
            
         # Fetch all associated work entries
        work_entries = payroll_run.work_entries.all()
        if not work_entries.exists():
            return Response({"error": "No work entries to process."}, status=status.HTTP_400_BAD_REQUEST)
            
        for entry in work_entries:
            if entry.employee.worker_type == 'hourly':
                rate = entry.employee.hourly_rate or Decimal('0.00')
                entry.gross_pay = Decimal(entry.hours_worked or 0) * rate
            elif entry.employee.worker_type == 'daily':
                rate = entry.employee.daily_rate or Decimal('0.00')
                entry.gross_pay = Decimal(entry.days_worked or 0) * rate
            else:
                entry.gross_pay = Decimal('0.00')
                
            ntry.net_pay = entry.gross_pay
            entry.is_paid = True
            entry.payment_type = 'bank_transfer'
            entry.payment_date = timezone.now().date()
            entry.save()
        
        payroll_run.is_closed = True
        payroll_run.date_processed = timezone.now()
        payroll_run.save()
        
        return Response({"message": "Payroll run closed successfully."}, status=status.HTTP_200_OK)
