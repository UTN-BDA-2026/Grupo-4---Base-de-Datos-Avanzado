import json
import logging
from django.db import transaction
from django.core.cache import cache
from ..models import Artist, Album, Song
from . import deezer
from concurrent.futures import ThreadPoolExecutor
from .enrichment import ensure_artist_complete, ensure_album_complete
from django.db.models import Q, Case, When, Value, IntegerField

logger = logging.getLogger(__name__)

def _save_artist(artist_data: dict) -> Artist:
    defaults = {
        'name': artist_data['name'],
        'image_url': artist_data.get('picture_medium', ''),
        'genres': [],
    }
    if artist_data.get('nb_fan') is not None:
        defaults['followers'] = artist_data['nb_fan']
    if artist_data.get('rank') is not None or artist_data.get('popularity') is not None:
        defaults['popularity'] = artist_data.get('rank', artist_data.get('popularity'))

    artist, _ = Artist.objects.update_or_create(deezer_id=str(artist_data['id']), defaults=defaults)
    return artist

def _save_album(album_data: dict, artist: Artist) -> Album:
    defaults = {
        'name':         album_data['title'],
        'cover_url':    album_data.get('cover_medium', ''),
        'release_date': album_data.get('release_date', ''),
        'album_type':   album_data.get('record_type', 'album'),
        'artist':       artist,
    }
    if album_data.get('nb_tracks') is not None:
        defaults['total_tracks'] = album_data['nb_tracks']

    album, _ = Album.objects.update_or_create(
        deezer_id=str(album_data['id']),
        defaults=defaults
    )
    return album

def _save_song(track_data: dict, artist: Artist, album: Album) -> Song:
    song, _ = Song.objects.update_or_create(
        deezer_id=str(track_data['id']),
        defaults={
            'title':        track_data['title'],
            'duration_ms':  track_data.get('duration', 0) * 1000,
            'track_number': track_data.get('track_number', track_data.get('track_position', 1)),
            'popularity':   track_data.get('rank', 0),
            'preview_url':  track_data.get('preview', ''),
            'artist':       artist,
            'album':        album,
        }
    )
    return song

def _get_or_fetch_artist(deezer_id: str) -> Artist | None:
    try:
        artist = Artist.objects.get(deezer_id=deezer_id)
        return ensure_artist_complete(artist, _save_artist)
    except Artist.DoesNotExist:
        try:
            return _save_artist(deezer.get_artist(deezer_id))
        except Exception as e:
            logger.error(f"Error obteniendo artista {deezer_id}: {e}")
            return None

def search_songs(query: str, limit: int = 20) -> list:
    cache_key = f'search:{query.lower()}:{limit}'
    cached = cache.get(cache_key)

    if cached:
        return list(Song.objects.select_related('artist', 'album').filter(id__in=json.loads(cached)).order_by('-popularity'))

    local_songs = list(
        Song.objects.select_related('artist', 'album')
        .filter(Q(title__icontains=query) | Q(artist__name__icontains=query) | Q(album__name__icontains=query))
        .annotate(
            relevance=Case(
                When(title__iexact=query, then=Value(0)),
                When(title__istartswith=query, then=Value(1)),
                default=Value(2),
                output_field=IntegerField(),
            )
        )
        .order_by('relevance', '-popularity')[:limit]
    )

    if len(local_songs) >= limit:
        cache.set(cache_key, json.dumps([s.id for s in local_songs]), timeout=300)
        return local_songs

    for track in deezer.search_tracks(query, limit=limit):
        if len(local_songs) >= limit: break
        try:
            with transaction.atomic():
                artist, _ = Artist.objects.get_or_create(
                    deezer_id=str(track['artist']['id']),
                    defaults={'name': track['artist']['name'], 'image_url': track['artist'].get('picture_medium', '')}
                )
                album, _ = Album.objects.get_or_create(
                    deezer_id=str(track['album']['id']),
                    defaults={'name': track['album']['title'], 'cover_url': track['album'].get('cover_medium', ''), 'artist': artist}
                )
                local_songs.append(_save_song(track, artist, album))
        except Exception as e:
            logger.warning(f"Error procesando track de búsqueda: {e}")

    if local_songs:
        cache.set(cache_key, json.dumps([s.id for s in local_songs]), timeout=300)
    return local_songs[:limit]

def get_top_songs(limit: int = 50) -> list:
    return list(Song.objects.select_related('artist', 'album').order_by('-popularity')[:limit])

def get_song_detail(deezer_id: str) -> Song | None:
    try:
        return Song.objects.select_related('artist', 'album').get(deezer_id=deezer_id)
    except Song.DoesNotExist:
        try:
            track = deezer.get_track(deezer_id)
            with transaction.atomic():
                artist = _save_artist(deezer.get_artist(track['artist']['id']))
                album = _save_album(deezer.get_album(track['album']['id']), artist)
                return _save_song(track, artist, album)
        except Exception as e:
            logger.error(f"Error en detalle de canción {deezer_id}: {e}")
            return None

def get_artist_detail(deezer_id: str) -> Artist | None:
    return _get_or_fetch_artist(deezer_id)

def get_songs_by_artist(deezer_id: str, limit: int = 20) -> list:
    local_songs = list(Song.objects.select_related('artist', 'album').filter(artist__deezer_id=deezer_id).order_by('-popularity')[:limit])
    if local_songs: return local_songs

    artist = _get_or_fetch_artist(deezer_id)
    if not artist: return []

    try:
        tracks_from_api = deezer.get_artist_top_tracks(deezer_id, limit=limit)
        saved_songs, album_cache = [], {}
        
        for track in tracks_from_api:
            album_id = str(track.get('album', {}).get('id'))
            if album_id not in album_cache:
                album = Album.objects.filter(deezer_id=album_id).first()
                if not album:
                    try:
                        album = _save_album(deezer.get_album(album_id), artist)
                    except Exception:
                        album, _ = Album.objects.get_or_create(
                            deezer_id=album_id, 
                            defaults={'name': track['album'].get('title', ''), 'cover_url': track['album'].get('cover_medium', ''), 'artist': artist}
                        )
                album_cache[album_id] = album
            
            with transaction.atomic():
                saved_songs.append(_save_song(track, artist, album_cache[album_id]))
        return saved_songs[:limit]
    except Exception as e:
        logger.error(f"Error top tracks del artista {deezer_id}: {e}")
        return []

ALBUM_TYPE_FILTERS = {
    'album': ['album'],
    'singles': ['single', 'ep'],
    'popular': ['album', 'single', 'ep', 'compile'],
    'all': None,
}

def get_albums_by_artist(deezer_id: str, record_type: str = 'album') -> list:
    allowed_types = ALBUM_TYPE_FILTERS.get(record_type, ['album'])
    queryset = Album.objects.select_related('artist').filter(artist__deezer_id=deezer_id)
    if allowed_types is not None:
        queryset = queryset.filter(album_type__in=allowed_types)

    local_albums = list(queryset.order_by('-release_date'))
    if local_albums:
        return [ensure_album_complete(a, _save_album) for a in local_albums]

    artist = _get_or_fetch_artist(deezer_id)
    if not artist: return []

    try:
        saved_albums = [_save_album(adm, artist) for adm in deezer.get_artist_albums(deezer_id)]
        filtered = saved_albums if allowed_types is None else [a for a in saved_albums if a.album_type in allowed_types]
        return sorted(filtered, key=lambda a: a.release_date or '', reverse=True)
    except Exception as e:
        logger.error(f"Error álbumes del artista {deezer_id}: {e}")
        return []

def get_album_detail(deezer_id: str) -> Album | None:
    try:
        album = Album.objects.select_related('artist').get(deezer_id=deezer_id)
        return ensure_album_complete(album, _save_album)
    except Album.DoesNotExist:
        try:
            album_data = deezer.get_album(deezer_id)
            artist = _save_artist(deezer.get_artist(album_data['artist']['id']))
            return _save_album(album_data, artist)
        except Exception as e:
            logger.error(f"Error en detalle de álbum {deezer_id}: {e}")
            return None

def get_songs_by_album(deezer_id: str) -> list:
    local_songs = list(Song.objects.select_related('artist', 'album').filter(album__deezer_id=deezer_id).order_by('track_number'))
    
    try:
        album = Album.objects.get(deezer_id=deezer_id)
        album = ensure_album_complete(album, _save_album)
        if local_songs and len(local_songs) >= album.total_tracks:
            return local_songs
    except Album.DoesNotExist:
        album = get_album_detail(deezer_id)
        if not album: return []

    try:
        saved_songs = []
        for track in deezer.get_album_tracks(deezer_id, limit=100):
            with transaction.atomic():
                saved_songs.append(_save_song(track, album.artist, album))
        return sorted(saved_songs, key=lambda s: s.track_number)
    except Exception as e:
        logger.error(f"Error canciones del álbum {deezer_id}: {e}")
        return local_songs if local_songs else []

def get_top_artists(limit: int = 20) -> list:
    cache_key = f'home:top_artists_followers:{limit}'
    cached = cache.get(cache_key)
    if cached:
        return list(Artist.objects.filter(id__in=json.loads(cached)))

    try:
        chart_data = deezer.get_top_artists(limit=limit)
        existing_map = {
            a.deezer_id: a
            for a in Artist.objects.filter(deezer_id__in=[str(d['id']) for d in chart_data])
        }

        def resolve(artist_data: dict) -> dict:
            local = existing_map.get(str(artist_data['id']))
            if not local or local.followers == 0:
                try:
                    return deezer.get_artist(artist_data['id'])
                except Exception as e:
                    logger.warning(f"No se pudo refrescar artista {artist_data.get('id')}: {e}")
                    return artist_data
            return artist_data

        with ThreadPoolExecutor(max_workers=10) as executor:
            resolved_data = list(executor.map(resolve, chart_data))

        local_artists = [_save_artist(d) for d in resolved_data]

        # Respaldo en caso de que los charts de la API queden cortos (menos de 20)
        if len(local_artists) < limit:
            missing = limit - len(local_artists)
            exclude_ids = [a.deezer_id for a in local_artists]
            backup = Artist.objects.exclude(deezer_id__in=exclude_ids).order_by('-followers')[:missing]
            local_artists.extend(list(backup))

        if local_artists:
            cache.set(cache_key, json.dumps([a.id for a in local_artists]), timeout=600)
            return local_artists[:limit]
    except Exception as e:
        logger.warning(f"Error Deezer Charts, usando respaldo local: {e}")
    return list(Artist.objects.order_by('-followers')[:limit])

def get_top_albums(limit: int = 20) -> list:
    cache_key = f'home:top_albums:{limit}'
    cached = cache.get(cache_key)
    if cached:
        return list(Album.objects.select_related('artist').filter(id__in=json.loads(cached)))

    try:
        chart_data = deezer.get_top_albums(limit=limit)
        existing_map = {
            a.deezer_id: a
            for a in Album.objects.filter(deezer_id__in=[str(d['id']) for d in chart_data])
        }

        def resolve(album_data: dict) -> dict:
            local = existing_map.get(str(album_data['id']))
            if not local or local.total_tracks == 0 or not local.release_date:
                try:
                    return deezer.get_album(album_data['id'])
                except Exception as e:
                    logger.warning(f"No se pudo refrescar álbum {album_data.get('id')}: {e}")
                    return album_data
            return album_data

        with ThreadPoolExecutor(max_workers=10) as executor:
            resolved_data = list(executor.map(resolve, chart_data))

        local_albums = []
        for album_data in resolved_data:
            with transaction.atomic():
                artist, _ = Artist.objects.get_or_create(
                    deezer_id=str(album_data['artist']['id']),
                    defaults={'name': album_data['artist']['name'], 'image_url': album_data['artist'].get('picture_medium', '')}
                )
                local_albums.append(_save_album(album_data, artist))

        if local_albums:
            cache.set(cache_key, json.dumps([a.id for a in local_albums]), timeout=600)
            return local_albums
    except Exception as e:
        logger.warning(f"Error Deezer top álbumes, usando respaldo local: {e}")
    return list(Album.objects.select_related('artist').all()[:limit])