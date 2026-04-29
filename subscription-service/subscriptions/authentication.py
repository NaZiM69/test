import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from django.contrib.auth.models import AnonymousUser

class MockUser:
    """A mock user class to represent the authenticated user from the token."""
    def __init__(self, user_id, is_staff=False):
        self.id = user_id
        self.pk = user_id
        self.is_staff = is_staff

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_active(self):
        return True

class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            # Format: Bearer <token>
            token = auth_header.split(' ')[1]
            print(f"Decoding token: {token[:10]}...")
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            print(f"Payload: {payload}")
        except jwt.ExpiredSignatureError:
            print("Token expired")
            raise exceptions.AuthenticationFailed('Token expired')
        except (jwt.InvalidTokenError, IndexError) as e:
            print(f"Invalid token error: {e}")
            raise exceptions.AuthenticationFailed('Invalid token')

        user_id = payload.get('user_id')
        is_staff = payload.get('is_staff', False)
        
        if user_id is None:
            raise exceptions.AuthenticationFailed('User ID not found in token')

        return (MockUser(user_id, is_staff), token)
