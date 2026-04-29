import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'subscription_service.settings')
django.setup()

from subscriptions.models import SubscriptionPlan

plans = [
    {'name': 'Basic', 'price': 29.00, 'duration_days': 30},
    {'name': 'Pro', 'price': 59.00, 'duration_days': 30},
    {'name': 'Elite', 'price': 99.00, 'duration_days': 30},
]

for plan_data in plans:
    plan, created = SubscriptionPlan.objects.get_or_create(
        name=plan_data['name'],
        defaults={'price': plan_data['price'], 'duration_days': plan_data['duration_days']}
    )
    if created:
        print(f"Created plan: {plan.name}")
    else:
        print(f"Plan already exists: {plan.name}")
