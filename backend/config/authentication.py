import logging
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.exceptions import AuthenticationFailed

logger = logging.getLogger(__name__)

class JWTQueryParamAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.query_params.get('token')
        if not token:
            return None

        try:
            validated_token = self.get_validated_token(token)
            user = self.get_user(validated_token)
            logger.info(f"[JWTQueryParamAuth] Usuario autenticado: {user}")
            return user, validated_token
        except Exception as e:
            logger.error(f"[JWTQueryParamAuth] Falló validación: {type(e).__name__}: {e}")
            raise AuthenticationFailed(str(e))