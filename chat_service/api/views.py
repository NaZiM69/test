from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ChatRequestSerializer
from .llm import chat_with_coach

class ChatView(APIView):
    def post(self, request):
        serializer = ChatRequestSerializer(data=request.data)
        if serializer.is_valid():
            try:
                reply = chat_with_coach(
                    serializer.validated_data["messages"],
                    serializer.validated_data.get("context")
                )
                return Response({"reply": reply}, status=status.HTTP_200_OK)
            except Exception as e:
                print("Chat Exception:", e)
                return Response(
                    {"detail": "Could not communicate with the coach."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
