from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserProfileSerializer
from .prompt_builder import build_prompt, UserProfile as PydanticUserProfile
from .llm import generate_program_json
from .models import UserProfile, FitnessProgram, WorkoutDay, Exercise

class GenerateProgramView(APIView):
    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid():
            # Convert to pydantic model to reuse prompt_builder logic cleanly
            profile = PydanticUserProfile(**serializer.validated_data)
            try:
                prompt = build_prompt(profile)
                program_json = generate_program_json(prompt)
                
                # Save to database
                db_user = UserProfile.objects.create(
                    user_id=profile.user_id,
                    name=profile.name,
                    age=profile.age,
                    weight_kg=profile.weight_kg,
                    height_cm=profile.height_cm,
                    goal=profile.goal,
                    level=profile.level,
                    days_available=profile.days_available,
                    equipment=profile.equipment,
                )
                
                db_program = FitnessProgram.objects.create(
                    user_profile=db_user,
                    summary=program_json.get("summary", ""),
                    duration_weeks=program_json.get("duration_weeks", 0),
                    daily_calories=program_json.get("daily_calories", 0),
                    proteins_grams=program_json.get("macros", {}).get("proteins_grams", 0),
                    carbs_grams=program_json.get("macros", {}).get("carbs_grams", 0),
                    fats_grams=program_json.get("macros", {}).get("fats_grams", 0),
                )
                
                for day_data in program_json.get("sport_program", []):
                    db_day = WorkoutDay.objects.create(
                        fitness_program=db_program,
                        day=day_data.get("day", ""),
                        target_muscles=day_data.get("target_muscles", "")
                    )
                    
                    for ex_data in day_data.get("exercises", []):
                        Exercise.objects.create(
                            workout_day=db_day,
                            name=ex_data.get("name", ""),
                            sets=ex_data.get("sets", 0),
                            reps=str(ex_data.get("reps", "")),
                            rest_seconds=ex_data.get("rest_seconds", 0)
                        )
                
                # Add database internal IDs to response
                program_json["id"] = db_program.id
                return Response(program_json, status=status.HTTP_200_OK)
            except Exception as e:
                print("General Exception:", e)
                return Response(
                    {"detail": "Internal Server Error while generating the program."},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetProgramView(APIView):
    def get(self, request):
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"detail": "user_id is required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user_profile = UserProfile.objects.filter(user_id=user_id).latest('created_at')
            program = FitnessProgram.objects.filter(user_profile=user_profile).latest('created_at')
            
            # Manually build response to match generate format
            days = []
            for day in program.workout_days.all():
                exercises = []
                for ex in day.exercises.all():
                    exercises.append({
                        "name": ex.name,
                        "sets": ex.sets,
                        "reps": ex.reps,
                        "rest_seconds": ex.rest_seconds
                    })
                days.append({
                    "day": day.day,
                    "target_muscles": day.target_muscles,
                    "exercises": exercises
                })
            
            return Response({
                "summary": program.summary,
                "duration_weeks": program.duration_weeks,
                "daily_calories": program.daily_calories,
                "macros": {
                    "proteins_grams": program.proteins_grams,
                    "carbs_grams": program.carbs_grams,
                    "fats_grams": program.fats_grams
                },
                "sport_program": days
            })
        except (UserProfile.DoesNotExist, FitnessProgram.DoesNotExist):
            return Response({"detail": "No program found for this user."}, status=status.HTTP_404_NOT_FOUND)
