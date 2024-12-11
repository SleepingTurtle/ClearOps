from django.contrib import admin
from django.urls import path
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(["GET"])
def test_api(request):
    return Response({"message: Hello from backend"})


urlpatterns = [path("admin/", admin.site.urls), path("test-api/", test_api)]
