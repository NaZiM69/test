from rest_framework import viewsets
from .models import ClientProblem
from .serializers import ClientProblemSerializer
from .producer import send_notification

class ClientProblemViewSet(viewsets.ModelViewSet):
    queryset = ClientProblem.objects.all().order_by('-date')
    serializer_class = ClientProblemSerializer

    def perform_create(self, serializer):
        # Save the problem
        instance = serializer.save()
        
        # Send notification to RabbitMQ
        notification_data = {
            'id': instance.id,
            'user_id': instance.user_id,
            'problem': instance.problem,
            'date': instance.date.isoformat(),
            'type': 'NEW_PROBLEM'
        }
        send_notification(notification_data)
