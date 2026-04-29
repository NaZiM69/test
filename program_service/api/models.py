from django.db import models

class UserProfile(models.Model):
    user_id = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    weight_kg = models.FloatField()
    height_cm = models.FloatField()
    goal = models.CharField(max_length=100)
    level = models.CharField(max_length=50)
    days_available = models.IntegerField()
    equipment = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.goal}"

class FitnessProgram(models.Model):
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='programs')
    summary = models.CharField(max_length=255)
    duration_weeks = models.IntegerField()
    daily_calories = models.IntegerField()
    proteins_grams = models.IntegerField()
    carbs_grams = models.IntegerField()
    fats_grams = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.summary

class WorkoutDay(models.Model):
    fitness_program = models.ForeignKey(FitnessProgram, on_delete=models.CASCADE, related_name='workout_days')
    day = models.CharField(max_length=50)
    target_muscles = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.day} - {self.target_muscles}"

class Exercise(models.Model):
    workout_day = models.ForeignKey(WorkoutDay, on_delete=models.CASCADE, related_name='exercises')
    name = models.CharField(max_length=100)
    sets = models.IntegerField()
    reps = models.CharField(max_length=50)
    rest_seconds = models.IntegerField()

    def __str__(self):
        return self.name
