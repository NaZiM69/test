from rest_framework import serializers
from .models import ClientProblem

class ClientProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientProblem
        fields = ['id', 'user_id', 'problem', 'date']
        read_only_fields = ['date']
