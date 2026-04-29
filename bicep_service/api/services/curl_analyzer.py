import cv2
import mediapipe as mp
import numpy as np
import base64

mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

class CurlAnalyzer:
    def __init__(self):
        self.pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        
    def calculate_angle(self, a, b, c):
        a = np.array(a)  # First
        b = np.array(b)  # Mid
        c = np.array(c)  # End

        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)

        if angle > 180.0:
            angle = 360 - angle
        return angle

    def process_frame(self, image):
        """Processes a single BGR image array and returns the annotated image and feedback."""
        # Convert to RGB
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_rgb.flags.writeable = False

        # Detection
        results = self.pose.process(image_rgb)

        # Convert back to BGR
        image_rgb.flags.writeable = True
        image = cv2.cvtColor(image_rgb, cv2.COLOR_RGB2BGR)

        feedback = "Ready"
        box_color = (245, 117, 16)
        
        is_form_correct = True
        error_reasons = []

        try:
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark

                # Coordinates
                shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x, landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]

                vertical_up_from_hip = [hip[0], hip[1] - 0.1]
                vertical_down_from_shoulder = [shoulder[0], shoulder[1] + 0.1]

                elbow_angle = self.calculate_angle(shoulder, elbow, wrist)
                upper_arm_angle = self.calculate_angle(vertical_down_from_shoulder, shoulder, elbow)
                back_angle = self.calculate_angle(vertical_up_from_hip, hip, shoulder)

                # Annotate elbow angle
                cv2.putText(
                    image, str(int(elbow_angle)),
                    tuple(np.multiply(elbow, [image.shape[1], image.shape[0]]).astype(int)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA
                )

                if back_angle > 15:
                    is_form_correct = False
                    error_reasons.append("STRAIGHTEN BACK")
                if upper_arm_angle > 25:
                    is_form_correct = False
                    error_reasons.append("FIX ELBOW")

                if is_form_correct:
                    if elbow_angle > 160:
                        feedback = "CORRECT: EXTENDED"
                    elif elbow_angle < 45:
                        feedback = "CORRECT: SQUEEZE"
                    else:
                        feedback = "CORRECT FORM"
                    box_color = (0, 200, 0)
                else:
                    feedback = "INCORRECT: " + " | ".join(error_reasons)
                    box_color = (0, 0, 255)
        except Exception as e:
            pass

        # Status box overlay
        cv2.rectangle(image, (0, 0), (640, 73), box_color, -1)
        cv2.putText(image, "FORM FEEDBACK", (15, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 1, cv2.LINE_AA)
        cv2.putText(image, feedback, (15, 55), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)

        if results.pose_landmarks:
            mp_drawing.draw_landmarks(
                image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS,
                mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2),
            )

        return image, feedback

    def process_video(self, input_path, output_path):
        import subprocess
        import os
        cap = cv2.VideoCapture(input_path)
        
        # Get video properties
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)

        # Write to a temporary file first
        temp_output = output_path.replace('.mp4', '_temp.mp4')
        
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_output, fourcc, fps, (width, height))

        feedbacks = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            annotated_frame, feedback = self.process_frame(frame)
            out.write(annotated_frame)
            feedbacks.append(feedback)

        cap.release()
        out.release()
        
        # Transcode the temporary 'mp4v' video to web-compatible 'h264' using FFmpeg
        subprocess.run(["ffmpeg", "-y", "-i", temp_output, "-vcodec", "libx264", output_path], capture_output=True)
        
        # Clean up temporary file
        if os.path.exists(temp_output):
            os.remove(temp_output)
        
        errors = [f for f in feedbacks if "INCORRECT" in f]
        return {
            "total_frames": len(feedbacks),
            "error_frames": len(errors),
            "most_common_error": max(set(errors), key=errors.count) if errors else "None"
        }
