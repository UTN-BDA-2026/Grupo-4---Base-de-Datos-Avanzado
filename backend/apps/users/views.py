from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services import login_user, logout_user, register_play, get_listening_history, get_recently_played
from .serializers import RegisterSerializer, UserSerializer, ListeningHistorySerializer
from apps.music.serializers import SongSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save() 
        
        login_result = login_user(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        return Response({
            'access': login_result['access'],
            'refresh': login_result['refresh'],
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response(
            {'error': 'Email y contraseña requeridos.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    result = login_user(email, password)

    if not result:
        return Response(
            {'error': 'Credenciales incorrectas.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    return Response({
        'access': result['access'],
        'refresh': result['refresh'],
        'user': UserSerializer(result['user']).data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'El refresh token es requerido.'}, status=status.HTTP_400_BAD_REQUEST)
    
    data, success = logout_user(refresh_token)
    if not success:
        return Response(data, status=status.HTTP_400_BAD_REQUEST)
        
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_history(request):
    song_id = request.data.get('song_id')
    if not song_id:
        return Response(
            {'error': 'song_id es requerido.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    result = register_play(request.user, song_id)
    if 'error' in result:
        return Response(result, status=status.HTTP_404_NOT_FOUND)
    return Response(result, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listening_history(request):
    limit   = int(request.query_params.get('limit', 20))
    history = get_listening_history(request.user, limit=limit)
    return Response(ListeningHistorySerializer(history, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recently_played(request):
    limit = int(request.query_params.get('limit', 10))
    songs = get_recently_played(request.user, limit=limit)
    return Response(SongSerializer(songs, many=True).data)