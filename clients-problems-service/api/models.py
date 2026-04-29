from django.db import models

class ClientProblem(models.Model):
    user_id = models.IntegerField()
    problem = models.TextField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Problem from User {self.user_id} on {self.date}"
