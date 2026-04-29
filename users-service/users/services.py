from .models import User

class UserService:
    @staticmethod
    def create_user(username, email, password, role=User.Role.CLIENT, **extra_fields):
        """
        Service layer function to create a user.
        """
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            **extra_fields
        )
        return user

    @staticmethod
    def update_user_profile(user, **data):
        """
        Updates common user fields.
        """
        for attr, value in data.items():
            setattr(user, attr, value)
        user.save()
        return user
