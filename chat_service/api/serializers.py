from rest_framework import serializers

class ChatMessageSerializer(serializers.Serializer):
    role = serializers.CharField()
    content = serializers.CharField()

class ChatRequestSerializer(serializers.Serializer):
    messages = ChatMessageSerializer(many=True)
    context = serializers.DictField(required=False, allow_null=True)
