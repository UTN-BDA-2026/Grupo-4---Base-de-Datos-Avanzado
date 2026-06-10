from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services import (
    get_user_playlists,
    get_playlist_detail,
    create_playlist,
    update_playlist,
    add_song_to_playlist,
    remove_song_from_playlist,
    delete_playlist,
)
from .serializers import PlaylistSerializer, PlaylistCreateSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def playlists(request):
    if request.method == 'GET':
        result = get_user_playlists(request.user)
        return Response(PlaylistSerializer(result, many=True).data, status=status.HTTP_200_OK)

    if request.method == 'POST':
        serializer = PlaylistCreateSerializer(data=request.data)
        if serializer.is_valid():
            create_playlist(request.user, serializer.validated_data)
            return Response(
                {"message": "Playlist creada correctamente."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def playlist_detail(request, playlist_id):
    # Para GET y DELETE usamos el flujo directo del servicio
    if request.method == 'GET':
        playlist = get_playlist_detail(playlist_id, request.user)
        if not playlist:
            return Response(
                {'error': 'Playlist no encontrada o privada.'},
                status=status.HTTP_404_NOT_FOUND
            )
        return Response(PlaylistSerializer(playlist).data, status=status.HTTP_200_OK)

    # Conectado al servicio update_playlist para estandarizar el mensaje de respuesta
    if request.method == 'PUT':
        serializer = PlaylistCreateSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            result = update_playlist(playlist_id, request.user, serializer.validated_data)
            if 'error' in result:
                return Response(result, status=status.HTTP_404_NOT_FOUND)
            return Response(
                {"message": "Playlist actualizada correctamente."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        result = delete_playlist(playlist_id, request.user)
        if 'error' in result:
            return Response(result, status=status.HTTP_404_NOT_FOUND)
        return Response(
            {"message": "Playlist eliminada correctamente."},
            status=status.HTTP_200_OK
        )


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def playlist_songs(request, playlist_id, song_id=None):
    if request.method == 'POST':
        song_id_body = request.data.get('song_id')
        if not song_id_body:
            return Response(
                {'error': 'song_id es requerido en el cuerpo de la petición.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        result = add_song_to_playlist(playlist_id, song_id_body, request.user)
        if 'error' in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"message": "Canción agregada correctamente."},
            status=status.HTTP_201_CREATED
        )

    if request.method == 'DELETE':
        if not song_id:
            return Response(
                {'error': 'El ID de la canción debe especificarse en la URL.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        result = remove_song_from_playlist(playlist_id, song_id, request.user)
        if 'error' in result:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"message": "Canción eliminada de la playlist correctamente."},
            status=status.HTTP_200_OK
        )