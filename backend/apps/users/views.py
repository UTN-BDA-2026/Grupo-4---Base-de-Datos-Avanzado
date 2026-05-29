from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .services import register_user, login_user, logout_user
from .serializers import RegisterSerializer, UserSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """POST /api/users/register/"""
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = register_user(serializer.validated_data)
        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """POST /api/users/login/"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Usuario y contraseña requeridos.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = login_user(request, username, password)
    if not user:
        return Response(
            {'error': 'Credenciales incorrectas.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response(UserSerializer(user).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    """POST /api/users/logout/"""
    logout_user(request)
    return Response({'message': 'Sesión cerrada correctamente.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    """GET /api/users/profile/"""
    return Response(UserSerializer(request.user).data)