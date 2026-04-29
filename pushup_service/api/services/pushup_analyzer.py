import cv2
import numpy as np
import os
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class PushupAnalyzer:
    def __init__(self):
        self.model = None
        self.model_path = os.path.join(settings.BASE_DIR, 'pushup_model.h5')
        self.loaded = False

    def load_model_if_exists(self):
        if not self.loaded and os.path.exists(self.model_path):
            try:
                import keras
                
                os.environ["KERAS_BACKEND"] = "tensorflow"

                # Define a patched Dense layer that ignores quantization_config
                class PatchedDense(keras.layers.Dense):
                    def __init__(self, *args, **kwargs):
                        kwargs.pop('quantization_config', None)
                        super().__init__(*args, **kwargs)

                # Also patch other potential problematic layers if necessary
                class PatchedBatchNormalization(keras.layers.BatchNormalization):
                    def __init__(self, *args, **kwargs):
                        kwargs.pop('quantization_config', None)
                        super().__init__(*args, **kwargs)

                # Try loading with custom objects
                custom_objects = {
                    'Dense': PatchedDense,
                    'BatchNormalization': PatchedBatchNormalization
                }
                
                self.model = keras.models.load_model(
                    self.model_path, 
                    custom_objects=custom_objects, 
                    compile=False,
                    safe_mode=False # Allow loading from potentially 'unsafe' config
                )
                self.loaded = True
                logger.info("MobileNet model loaded successfully with patched layers.")
                        
            except Exception as e:
                logger.error(f"Error loading model: {e}")
                # Last resort: try to use the manual JSON cleaning if custom_objects failed
                try:
                    import h5py
                    import json
                    with h5py.File(self.model_path, 'r') as f:
                        model_config = f.attrs.get('model_config')
                        if model_config:
                            config = json.loads(model_config.decode('utf-8') if isinstance(model_config, bytes) else model_config)
                            def strip_keys(obj):
                                if isinstance(obj, dict):
                                    obj.pop('quantization_config', None)
                                    obj.pop('build_config', None)
                                    for v in obj.values(): strip_keys(v)
                                elif isinstance(obj, list):
                                    for item in obj: strip_keys(item)
                            strip_keys(config)
                            self.model = keras.models.model_from_json(json.dumps(config))
                            self.model.load_weights(self.model_path)
                            self.loaded = True
                except:
                    pass

    def process_frame(self, image):
        self.load_model_if_exists()
        
        box_color = (100, 100, 100) # Gray for pending
        feedback = "En attente du modele"
        details = "Veuillez placer pushup_model.h5"

        if self.model is None:
            # Status box overlay
            cv2.rectangle(image, (0, 0), (640, 100), box_color, -1)
            cv2.putText(image, "STATUT MODELE", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2, cv2.LINE_AA)
            cv2.putText(image, feedback, (15, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2, cv2.LINE_AA)
            cv2.putText(image, details, (15, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 255), 2, cv2.LINE_AA)
            return image, "Model not loaded"

        try:
            import keras
            # 1. Resize to expected MobileNet input size
            img_resized = cv2.resize(image, (224, 224))
            
            # 2. Convert BGR (OpenCV) to RGB (Keras)
            img_rgb = cv2.cvtColor(img_resized, cv2.COLOR_BGR2RGB)
            
            # 3. Preprocess for MobileNet
            input_data = np.expand_dims(img_rgb, axis=0)
            
            # It's common to normalize to [-1, 1] for MobileNet
            input_data = keras.applications.mobilenet.preprocess_input(input_data)
            
            # 4. Predict
            preds = self.model.predict(input_data, verbose=0)[0]
            
            # Try to handle shape
            if len(preds) == 1:
                # Binary crossentropy
                prob_incorrect = preds[0] * 100
                prob_correct = (1.0 - preds[0]) * 100
            elif len(preds) == 2:
                # Categorical. Alphabetically 'correct' is 0, 'incorrect' is 1
                prob_correct = preds[0] * 100
                prob_incorrect = preds[1] * 100
            else:
                prob_correct = 50.0
                prob_incorrect = 50.0

            # Determine winner
            if prob_incorrect > prob_correct:
                is_correct = False
                feedback = "Posture INCORRECTE"
                box_color = (0, 0, 255) # Red
            else:
                is_correct = True
                feedback = "Posture CORRECTE"
                box_color = (0, 200, 0) # Green
                
            details = f"{prob_incorrect:.1f}% incorrect | {prob_correct:.1f}% correct"

        except Exception as e:
            feedback = "Erreur de prediction"
            details = str(e)
            box_color = (0, 0, 255)

        # Status box overlay
        cv2.rectangle(image, (0, 0), (640, 100), box_color, -1)
        cv2.putText(image, "FORM FEEDBACK", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2, cv2.LINE_AA)
        cv2.putText(image, feedback, (15, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2, cv2.LINE_AA)
        cv2.putText(image, details, (15, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1, cv2.LINE_AA)

        return image, f"{feedback} - {details}"

    def process_video(self, input_path, output_path):
        import subprocess
        cap = cv2.VideoCapture(input_path)
        
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)

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
        
        # Transcode strictly to h264 for web
        subprocess.run(["ffmpeg", "-y", "-i", temp_output, "-vcodec", "libx264", output_path], capture_output=True)
        
        if os.path.exists(temp_output):
            os.remove(temp_output)
        
        incorrect_frames = [f for f in feedbacks if "INCORRECTE" in f]
        return {
            "total_frames": len(feedbacks),
            "error_frames": len(incorrect_frames),
            "percentage_incorrect": f"{(len(incorrect_frames)/len(feedbacks)*100 if feedbacks else 0):.1f}%"
        }
