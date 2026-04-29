from rest_framework import serializers
from .models import SubscriptionPlan, Subscription

class SubscriptionPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPlan
        fields = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    plan_name = serializers.ReadOnlyField(source='plan.name')
    
    class Meta:
        model = Subscription
        fields = ['id', 'user_id', 'plan', 'plan_name', 'start_date', 'end_date', 'is_active']
        read_only_fields = ['user_id', 'end_date', 'is_active']
