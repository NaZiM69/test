from django.urls import path
from .views import (
    PlanListView, PlanDetailView, SubscribeView, MySubscriptionView, 
    AdminSubscriptionListView, AdminSubscriptionToggleView
)

urlpatterns = [
    path('plans/', PlanListView.as_view(), name='plan-list'),
    path('plans/<int:pk>/', PlanDetailView.as_view(), name='plan-detail'),
    path('subscribe/', SubscribeView.as_view(), name='subscribe'),
    path('my-subscription/', MySubscriptionView.as_view(), name='my-subscription'),
    path('admin/subscriptions/', AdminSubscriptionListView.as_view(), name='admin-subscriptions'),
    path('admin/subscriptions/<int:pk>/toggle/', AdminSubscriptionToggleView.as_view(), name='admin-subscription-toggle'),
]
