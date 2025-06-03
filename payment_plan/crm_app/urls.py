from django.urls import path, include
from rest_framework.routers import DefaultRouter
from crm_app import views


router = DefaultRouter()
router.register(r'plans', views.PaymentPlanView, basename='paymentplan')
router.register(r'installments', views.InstallmentView, basename='installment')

urlpatterns = [
    path('', include(router.urls)),
]