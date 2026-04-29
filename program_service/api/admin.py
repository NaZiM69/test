from django.contrib import admin
from .models import UserProfile, FitnessProgram, WorkoutDay, Exercise

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'goal', 'level', 'days_available', 'equipment', 'created_at')
    search_fields = ('name', 'goal')

@admin.register(FitnessProgram)
class FitnessProgramAdmin(admin.ModelAdmin):
    list_display = ('summary', 'duration_weeks', 'daily_calories', 'proteins_grams', 'carbs_grams', 'fats_grams', 'created_at')
    search_fields = ('summary',)

@admin.register(WorkoutDay)
class WorkoutDayAdmin(admin.ModelAdmin):
    list_display = ('day', 'target_muscles', 'fitness_program')
    search_fields = ('day', 'target_muscles')

@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ('name', 'sets', 'reps', 'rest_seconds', 'workout_day')
    search_fields = ('name',)
