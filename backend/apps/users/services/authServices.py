from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

def login_user(email: str, password: str):
    user = authenticate(username=email, password=password)

    if not user:
        return None

    refresh = RefreshToken.for_user(user)

    return {
        'user': user,
        'access': str(refresh.access_token),
        'refresh': str(refresh),
    }

def logout_user(refresh_token: str):
    try:
        token = RefreshToken(refresh_token)
        token.blacklist()
        return {'message': 'Sesión cerrada correctamente.'}, True
    except TokenError:
        return {'error': 'Token inválido o expirado.'}, False