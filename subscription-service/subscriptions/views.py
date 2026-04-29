from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import Case, When, BooleanField, Value
from .models import SubscriptionPlan, Subscription
from .serializers import SubscriptionPlanSerializer, SubscriptionSerializer

class PlanListView(generics.ListCreateAPIView):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    
    def get_permissions(self):
        return [permissions.AllowAny()]
    authentication_classes = []

class PlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SubscriptionPlan.objects.all()
    serializer_class = SubscriptionPlanSerializer
    permission_classes = [permissions.AllowAny]

class SubscribeView(generics.CreateAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def perform_create(self, serializer):
        # Allow user_id from body if not authenticated (development mode)
        user_id = self.request.data.get('user')
        if not user_id and self.request.user.is_authenticated:
            user_id = self.request.user.id
        
        # Deactivate any previous active subscriptions for this user
        Subscription.objects.filter(user_id=user_id, is_active=True).update(is_active=False)
        
        serializer.save(user_id=user_id)

class MySubscriptionView(generics.RetrieveAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Filter by both is_active flag AND end_date not yet passed
        # This ensures expired subscriptions are never returned,
        # even if is_active was never updated in the DB.
        now = timezone.now()
        return Subscription.objects.filter(
            user_id=self.request.user.id,
            is_active=True,
            end_date__gt=now
        ).order_by('-start_date', '-id').first()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance:
            return Response({"detail": "No active subscription found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

class AdminSubscriptionListView(generics.ListAPIView):
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def get_queryset(self):
        now = timezone.now()
        # Annotate each subscription with a real-time is_expired flag
        return Subscription.objects.annotate(
            is_expired=Case(
                When(end_date__lte=now, then=Value(True)),
                default=Value(False),
                output_field=BooleanField()
            )
        ).order_by('-start_date', '-id')

class AdminSubscriptionToggleView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, pk):
        try:
            subscription = Subscription.objects.get(pk=pk)

            # Prevent toggling a subscription that has already expired by time
            if timezone.now() > subscription.end_date:
                return Response(
                    {"detail": "Cannot toggle an expired subscription."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            subscription.is_active = not subscription.is_active
            subscription.save()
            return Response({
                "status": "updated",
                "is_active": subscription.is_active
            })
        except Subscription.DoesNotExist:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)
