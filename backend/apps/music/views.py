from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Q, Case, When, Value, IntegerField
from .services import (
    search_songs,
    get_song_detail,
    get_artist_detail,
    get_top_songs,
    get_songs_by_artist,
    get_albums_by_artist,
    get_album_detail,
    get_songs_by_album,
    get_top_artists,
    get_top_albums,
)
from .serializers import (
    SongSerializer, 
    ArtistSerializer, 
    AlbumSerializer, 
    TopArtistSerializer, 
    TopAlbumSerializer,
    UserAlbumSerializer,
    UserArtistSerializer
)
from .models import Artist, Album, UserAlbum , UserArtist
from apps.playlists.models import Playlist
from apps.playlists.serializers import PlaylistSearchSerializer
from django.http import HttpResponse
from django.shortcuts import redirect
from django.http import HttpResponse

import requests as http_requests
from django.http import HttpResponse

@api_view(['GET'])
@authentication_classes([])
@permission_classes([AllowAny])
def proxy_preview(request, deezer_id):
    from django.core.cache import cache

    cache_key = f'preview_audio:{deezer_id}'
    cached_audio = cache.get(cache_key)
    if cached_audio:
        response = HttpResponse(cached_audio, content_type='audio/mpeg')
        response['Access-Control-Allow-Origin'] = '*'
        response['Accept-Ranges'] = 'bytes'
        response['Content-Length'] = len(cached_audio)
        return response

    song = get_song_detail(str(deezer_id))
    preview_url = song.preview_url if song else None

    if not preview_url:
        try:
            from .services import deezer as deezer_client
            track_data = deezer_client.get_track(deezer_id)
            preview_url = track_data.get('preview', '')
        except Exception as e:
            print(f"Error obteniendo track de Deezer: {e}")
            return HttpResponse(status=404)

    if not preview_url:
        return HttpResponse(status=404)

    try:
        deezer_response = http_requests.get(
            preview_url,
            timeout=15,
            headers={'Referer': 'https://www.deezer.com/', 'User-Agent': 'Mozilla/5.0'},
        )

        if deezer_response.status_code == 403 and song:
            try:
                from .services import deezer as deezer_client
                track_data = deezer_client.get_track(deezer_id)
                fresh_url = track_data.get('preview', '')
                if fresh_url:
                    song.preview_url = fresh_url
                    song.save(update_fields=['preview_url'])
                    deezer_response = http_requests.get(
                        fresh_url,
                        timeout=15,
                        headers={'Referer': 'https://www.deezer.com/', 'User-Agent': 'Mozilla/5.0'},
                    )
            except Exception:
                return HttpResponse(status=502)

        if deezer_response.status_code != 200:
            return HttpResponse(status=deezer_response.status_code)

        cache.set(cache_key, deezer_response.content, timeout=86400)

        response = HttpResponse(deezer_response.content, content_type='audio/mpeg')
        response['Access-Control-Allow-Origin'] = '*'
        response['Accept-Ranges'] = 'bytes'
        response['Content-Length'] = len(deezer_response.content)
        return response

    except http_requests.RequestException:
        return HttpResponse(status=502)

def _relevance_case(field_name: str, query: str):
    """Devuelve una anotación de relevancia: 0 = exacto, 1 = empieza con, 2 = contiene."""
    return Case(
        When(**{f'{field_name}__iexact': query}, then=Value(0)),
        When(**{f'{field_name}__istartswith': query}, then=Value(1)),
        default=Value(2),
        output_field=IntegerField(),
    )


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
    songs = []

    if search_type in ('all', 'songs'):
        songs = search_songs(query, limit=limit)
        results['songs'] = SongSerializer(songs, many=True).data

    if search_type in ('all', 'artist'):
        artist_ids_from_songs = {s.artist_id for s in songs if s.artist_id}
        artists = list(
            Artist.objects.filter(
                Q(name__icontains=query) | Q(id__in=artist_ids_from_songs)
            )
            .annotate(relevance=_relevance_case('name', query))
            .order_by('relevance', '-followers')[:limit]
        )
        results['artists'] = ArtistSerializer(artists, many=True, context={'request': request}).data

    if search_type in ('all', 'album'):
        album_ids_from_songs = {s.album_id for s in songs if s.album_id}
        albums = list(
            Album.objects.filter(
                Q(name__icontains=query) | Q(id__in=album_ids_from_songs)
            )
            .annotate(relevance=_relevance_case('name', query))
            .order_by('relevance', '-release_date')[:limit]
        )
        results['albums'] = AlbumSerializer(albums, many=True).data

    if search_type in ('all', 'playlist'):
        playlists = list(
            Playlist.objects.filter(
                Q(name__icontains=query) | Q(songs__title__icontains=query),
                Q(is_public=True) | Q(user=request.user)
            )
            .distinct() 
            .annotate(relevance=_relevance_case('name', query))
            .order_by('relevance', '-updated_at')[:limit]
        )
        results['playlists'] = PlaylistSearchSerializer(playlists, many=True).data

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
    return Response(ArtistSerializer(artist, context={'request': request}).data)


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
    return Response(SongSerializer(songs, many=True, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def artist_albums(request, deezer_id):
    record_type = request.query_params.get('type', 'album')

    albums = get_albums_by_artist(deezer_id, record_type=record_type)

    if not albums:
        return Response({
            'message': f"El artista actualmente no cuenta con lanzamientos del tipo '{record_type}'.",
            'results': []
        }, status=status.HTTP_200_OK)

    serializer = AlbumSerializer(albums, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def album_detail(request, deezer_id):
    album = get_album_detail(deezer_id)
    if not album:
        return Response(
            {'error': 'Álbum no encontrado.'},
            status=status.HTTP_404_NOT_FOUND
        )
    return Response(AlbumSerializer(album).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def album_songs(request, deezer_id):
    songs = get_songs_by_album(deezer_id)
    return Response(SongSerializer(songs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_artists(request):
    limit   = int(request.query_params.get('limit', 20))
    artists = get_top_artists(limit=limit)
    return Response(TopArtistSerializer(artists, many=True).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def top_albums(request):
    limit = int(request.query_params.get('limit', 20))
    albums = get_top_albums(limit=limit)
    return Response(TopAlbumSerializer(albums, many=True).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_save_album(request, deezer_id):
    album = get_album_detail(str(deezer_id))
    
    if not album:
        return Response(
            {'error': 'No se pudo procesar u obtener el álbum solicitado.'}, 
            status=status.HTTP_404_NOT_FOUND
        )

    user_album_queryset = UserAlbum.objects.filter(user=request.user, album=album)

    if user_album_queryset.exists():
        user_album_queryset.delete()
        return Response({'saved': False, 'message': 'Álbum eliminado de tu biblioteca.'}, status=status.HTTP_200_OK)
    else:
        UserAlbum.objects.create(user=request.user, album=album)
        return Response({'saved': True, 'message': 'Álbum guardado en tu biblioteca con éxito.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_saved_albums(request):
    saved_albums = UserAlbum.objects.filter(user=request.user).select_related('album', 'album__artist')
    serializer = UserAlbumSerializer(saved_albums, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_follow_artist(request, deezer_id):
    artist = get_artist_detail(str(deezer_id))

    if not artist:
        return Response(
            {'error': 'No se pudo procesar u obtener el artista solicitado.'},
            status=status.HTTP_404_NOT_FOUND
        )

    user_artist_queryset = UserArtist.objects.filter(user=request.user, artist=artist)

    if user_artist_queryset.exists():
        user_artist_queryset.delete()
        return Response({'following': False, 'message': 'Dejaste de seguir al artista.'}, status=status.HTTP_200_OK)
    else:
        UserArtist.objects.create(user=request.user, artist=artist)
        return Response({'following': True, 'message': 'Ahora sigues a este artista.'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_followed_artists(request):
    followed = UserArtist.objects.filter(user=request.user).select_related('artist')
    serializer = UserArtistSerializer(followed, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)