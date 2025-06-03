from django.urls import path, include
from rest_framework.routers import DefaultRouter
from auth_app import views



urlpatterns = [
    path("role/", views.RoleView.as_view(),name="userrole"),
    path('signup/', views.SignupView.as_view(), name='signup')
]