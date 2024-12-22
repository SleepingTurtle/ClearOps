from rest_framework import routers
from django.urls import path, include

from .views import (
    EmployeeViewSet,
    WorkEntryViewSet,
    PayrollProcessView,
    PayrollRunViewSet,
)

router = routers.DefaultRouter()
router.register(r"employees", EmployeeViewSet)
router.register(r"workentries", WorkEntryViewSet)
router.register(r"payroll-runs", PayrollRunViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("process-payroll", PayrollProcessView.as_view(), name="process-payroll"),
]
