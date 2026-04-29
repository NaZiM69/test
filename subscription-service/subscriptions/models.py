from django.db import models
from django.utils import timezone
from datetime import timedelta

class SubscriptionPlan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_days = models.IntegerField()

    def __str__(self):
        return self.name

class Subscription(models.Model):
    user_id = models.IntegerField()  # Storing the ID from the users-service
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.CASCADE)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        # Ensure start_date is a datetime object if it's a string
        if isinstance(self.start_date, str):
            from django.utils.dateparse import parse_datetime, parse_date
            parsed = parse_datetime(self.start_date)
            if not parsed:
                d = parse_date(self.start_date)
                if d:
                    from django.utils import timezone
                    import datetime
                    parsed = timezone.make_aware(datetime.datetime.combine(d, datetime.time.min))
            self.start_date = parsed or timezone.now()
        
        # Only auto-calculate end_date if not set
        if not self.end_date:
            self.end_date = self.start_date + timedelta(days=self.plan.duration_days)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"User {self.user_id} - {self.plan.name}"
