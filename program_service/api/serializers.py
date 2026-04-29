from rest_framework import serializers

class UserProfileSerializer(serializers.Serializer):
    user_id = serializers.IntegerField(required=False, allow_null=True)
    name = serializers.CharField(max_length=100)
    age = serializers.IntegerField()
    weight_kg = serializers.FloatField()
    height_cm = serializers.FloatField()
    goal = serializers.CharField(max_length=100)
    level = serializers.CharField(max_length=50)
    days_available = serializers.IntegerField()
    equipment = serializers.CharField(max_length=100)
