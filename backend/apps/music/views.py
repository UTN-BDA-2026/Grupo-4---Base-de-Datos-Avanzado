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
from .models import Artist, Album

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def song_search(request):
    query = request.query_params.get('q', '').strip()
    if not query:
        return Response(
            {'error': 'El parámetro q es requerido.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    limit = int(request.query_params.get('limit', 20))
    search_type = request.query_params.get('type', 'all')

    results = {}

    if search_type in ['all', 'songs']:
         songs = search_songs(query, limit=limit)
         results['songs'] = SongSerializer(songs, many=True).data

    
    if search_type in ('all', 'artist'):
        artists = Artist.objects.filter(
            name__icontains=query
        ).order_by('-followers')[:limit]
        results['artists'] = ArtistSerializer(artists, many=True).data

    if search_type in ('all', 'album'):
        albums = Album.objects.filter(
            name__icontains=query
        ).order_by('-release_date')[:limit]
        results['albums'] = AlbumSerializer(albums, many=True).data

    return Response(results)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def song_detail(request, deezer_id):
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
    limit = int(request.query_params.get('limit', 50))
    songs = get_top_songs(limit=limit)
    return Response(SongSerializer(songs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def artist_songs(request, deezer_id):
    songs = get_songs_by_artist(deezer_id)
    return Response(SongSerializer(songs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def artist_albums(request, deezer_id):
    albums = get_albums_by_artist(deezer_id)
    return Response(AlbumSerializer(albums, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_artists(request):
    limit   = int(request.query_params.get('limit', 20))
    artists = get_top_artists(limit=limit)
    return Response(ArtistSerializer(artists, many=True).data)