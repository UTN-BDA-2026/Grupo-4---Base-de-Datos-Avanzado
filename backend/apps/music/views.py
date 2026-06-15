from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .services import (
    search_songs,
    get_song_detail,
    get_artist_detail,
    get_top_songs,
    get_songs_by_artist,
    get_albums_by_artist,
    get_top_artists,
)
from .serializers import SongSerializer, ArtistSerializer, AlbumSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def song_search(request):
    """GET /api/music/search/?q=radiohead&limit=10"""
    query = request.query_params.get('q', '').strip()
    if not query:
        return Response(
            {'error': 'El parámetro q es requerido.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    limit = int(request.query_params.get('limit', 20))
    songs = search_songs(query, limit=limit)
    data  = SongSerializer(songs, many=True).data
    return Response({'results': data, 'count': len(data)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def song_detail(request, deezer_id):
    """GET /api/music/songs/<deezer_id>/"""
    song = get_song_detail(deezer_id)
    if not song:
        return Response(
            {'error': 'Canción no encontrada.'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(SongSerializer(song).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def artist_detail(request, deezer_id):
    """GET /api/music/artists/<deezer_id>/"""
    artist = get_artist_detail(deezer_id)
    if not artist:
        return Response(
            {'error': 'Artista no encontrado.'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(ArtistSerializer(artist).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_songs(request):
    """GET /api/music/top/?limit=20"""
    limit = int(request.query_params.get('limit', 50))
    songs = get_top_songs(limit=limit)
    return Response(SongSerializer(songs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def artist_songs(request, deezer_id):
    """GET /api/music/artists/<deezer_id>/songs/"""
    songs = get_songs_by_artist(deezer_id)
    return Response(SongSerializer(songs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def artist_albums(request, deezer_id):
    """GET /api/music/artists/<deezer_id>/albums/"""
    albums = get_albums_by_artist(deezer_id)
    return Response(AlbumSerializer(albums, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_artists(request):
    """GET /api/music/artists/top/"""
    limit   = int(request.query_params.get('limit', 20))
    artists = get_top_artists(limit=limit)
    return Response(ArtistSerializer(artists, many=True).data)