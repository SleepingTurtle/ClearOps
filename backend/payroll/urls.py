from rest_framework import routers
from django.urls import path, include

from .views import (
    EmployeeViewSet,
    WorkEntryViewSet,
    BulkWorkEntryCreateView,
    PayrollRunViewSet,
)

router = routers.DefaultRouter()
router.register(r"employees", EmployeeViewSet)
router.register(r"workentries", WorkEntryViewSet)
router.register(r"payroll-runs", PayrollRunViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "work-entries/bulk-create/",
        BulkWorkEntryCreateView.as_view(),
        name="bulk-work-entry-create",
    ),
]
