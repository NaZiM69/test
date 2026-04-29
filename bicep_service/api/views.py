from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.conf import settings
import os
import cv2
import numpy as np
import base64
from .services.curl_analyzer import CurlAnalyzer

# Instantiate once to avoid reloading mediapipe models per request
analyzer = CurlAnalyzer()

class VideoAnalyzeView(APIView):
    def post(self, request):
        if 'video' not in request.FILES:
            return Response({"error": "No 'video' file provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        video_file = request.FILES['video']
        
        # Save uploaded file temporarily
        file_name = default_storage.save(f"uploads/{video_file.name}", video_file)
        input_path = os.path.join(settings.MEDIA_ROOT, file_name)
        
        # Prepare output path
        output_filename = f"annotated_{video_file.name}"
        output_relative_path = f"processed/{output_filename}"
        output_path = os.path.join(settings.MEDIA_ROOT, output_relative_path)
        
        # Ensure processed directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        try:
            summary = analyzer.process_video(input_path, output_path)
            
            # Optionally clean up the original upload
            # os.remove(input_path)

            video_url = request.build_absolute_uri(settings.MEDIA_URL + output_relative_path)
            
            return Response({
                "message": "Video processed successfully.",
                "summary": summary,
                "video_url": video_url
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FrameAnalyzeView(APIView):
    def post(self, request):
        if 'image' not in request.data:
            return Response({"error": "No 'image' base64 provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Parse base64 image (assuming format Data URI "data:image/jpeg;base64,...")
            b64_data = request.data['image'].split(',')[1] if ',' in request.data['image'] else request.data['image']
            image_bytes = base64.b64decode(b64_data)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            image_bgr = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            
            if image_bgr is None:
                return Response({"error": "Invalid image data."}, status=status.HTTP_400_BAD_REQUEST)

            # Process it
            annotated_frame, feedback = analyzer.process_frame(image_bgr)
            
            # Encode back to base64
            _, buffer = cv2.imencode('.jpg', annotated_frame)
            encoded_image = base64.b64encode(buffer).decode('utf-8')
            
            return Response({
                "feedback": feedback,
                "annotated_image": f"data:image/jpeg;base64,{encoded_image}"
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
