from django.db.models import Q
from django.db import transaction
from django.core.cache import cache
import json
from ..models import Artist, Album, Song
from . import deezer

def _save_artist(artist_data: dict) -> Artist:
    defaults = {
        'name':      artist_data['name'],
        'image_url': artist_data.get('picture_medium', ''),
        'genres':    [],
    }
    
    if 'nb_fan' in artist_data:
        defaults['followers']  = artist_data['nb_fan']
        defaults['popularity'] = artist_data['nb_fan']

    artist, _ = Artist.objects.update_or_create(
        deezer_id=str(artist_data['id']),
        defaults=defaults
    )
    return artist

def _save_album(album_data: dict, artist: Artist) -> Album:
    album, _ = Album.objects.update_or_create(
        deezer_id=str(album_data['id']),
        defaults={
            'name':         album_data['title'],
            'cover_url':    album_data.get('cover_medium', ''),
            'release_date': album_data.get('release_date', ''),
            'album_type':   album_data.get('record_type', 'album'),
            'total_tracks': album_data.get('nb_tracks', 0),
            'artist':       artist,
        }
    )
    return album

def _save_song(track_data: dict, artist: Artist, album: Album) -> Song:
    song, _ = Song.objects.update_or_create(
        deezer_id=str(track_data['id']),
        defaults={
            'title':        track_data['title'],
            'duration_ms':  track_data.get('duration', 0) * 1000,
            'track_number': track_data.get('track_position', 1),
            'popularity':   track_data.get('rank', 0),
            'preview_url':  track_data.get('preview', ''),
            'artist':       artist,
            'album':        album,
        }
    )
    return song

def search_songs(query: str, limit: int = 20) -> list:
    cache_key = f'search:{query.lower()}:{limit}'
    cached    = cache.get(cache_key)
    if cached:
        song_ids = json.loads(cached)
        return list(
            Song.objects
            .select_related('artist', 'album')
            .filter(id__in=song_ids)
            .order_by('-popularity')
        )
    
    local_songs = list(
        Song.objects.select_related('artist', 'album')
        .filter(
            Q(title__icontains=query) |
            Q(artist__name__icontains=query) |
            Q(album__name__icontains=query)
        )
        .order_by('-popularity')[:limit]
    )

    if len(local_songs) >= limit:
        cache.set(cache_key, json.dumps([s.id for s in local_songs]), timeout=300)
        return local_songs

    tracks_from_api = deezer.search_tracks(query, limit=limit)
    existing_ids    = {s.deezer_id for s in local_songs}

    for track in tracks_from_api:
        if len(local_songs) >= limit:
            break

        track_id = str(track['id'])

        if track_id not in existing_ids:
            try:
                with transaction.atomic():
                    artist_deezer_id = str(track['artist']['id'])
                    artist, _ = Artist.objects.get_or_create(
                        deezer_id=artist_deezer_id,
                        defaults={
                            'name':      track['artist']['name'],
                            'image_url': track['artist'].get('picture_medium', '')
                        }
                    )

                    album_deezer_id = str(track['album']['id'])
                    album, _ = Album.objects.get_or_create(
                        deezer_id=album_deezer_id,
                        defaults={
                            'name':      track['album']['title'],
                            'cover_url': track['album'].get('cover_medium', ''),
                            'artist':    artist
                        }
                    )

                    song = _save_song(track, artist, album)
                    local_songs.append(song)
                    existing_ids.add(track_id)

            except Exception as e:
                print(f"Error procesando track {track_id}: {e}")
                continue

    if local_songs:
        cache.set(cache_key, json.dumps([s.id for s in local_songs]), timeout=300)

    return local_songs[:limit]

def get_top_songs(limit: int = 50) -> list:
    return (
        Song.objects
        .select_related('artist', 'album')
        .order_by('-popularity')[:limit]
    )

def get_song_detail(deezer_id: str) -> Song | None:
    try:
        return Song.objects.select_related('artist', 'album').get(deezer_id=deezer_id)
    except Song.DoesNotExist:
        pass

    try:
        track = deezer.get_track(deezer_id)
        with transaction.atomic():
            artist_data = deezer.get_artist(track['artist']['id'])
            album_data  = deezer.get_album(track['album']['id'])
            artist = _save_artist(artist_data)
            album  = _save_album(album_data, artist)
            song   = _save_song(track, artist, album)
        return song
    except Exception:
        return None

def get_artist_detail(deezer_id: str) -> Artist | None:
    try:
        return Artist.objects.prefetch_related('songs').get(deezer_id=deezer_id)
    except Artist.DoesNotExist:
        pass

    try:
        artist_data = deezer.get_artist(deezer_id)
        return _save_artist(artist_data)
    except Exception:
        return None

def get_songs_by_artist(deezer_id: str, limit: int = 20) -> list:
    return (
        Song.objects
        .select_related('artist', 'album')
        .filter(artist__deezer_id=deezer_id)
        .order_by('-popularity')[:limit]
    )

def get_albums_by_artist(deezer_id: str) -> list:
    return (
        Album.objects
        .select_related('artist')
        .filter(artist__deezer_id=deezer_id)
        .order_by('-release_date')
    )

def get_album_detail(deezer_id: str) -> Album | None:
    try:
        return Album.objects.select_related('artist').get(deezer_id=deezer_id)
    except Album.DoesNotExist:
        pass

    try:
        album_data  = deezer.get_album(deezer_id)
        artist_data = deezer.get_artist(album_data['artist']['id'])
        with transaction.atomic():
            artist = _save_artist(artist_data)
            album  = _save_album(album_data, artist)
        return album
    except Exception:
        return None

def get_songs_by_album(deezer_id: str) -> list:
    return (
        Song.objects
        .select_related('artist', 'album')
        .filter(album__deezer_id=deezer_id)
        .order_by('track_number')
    )

def get_top_artists(limit: int = 10) -> list:
    cache_key = f'home:top_artists_followers:{limit}'
    
    try:
        top_artists_api = deezer.get_top_artists(limit=limit)
        local_artists = []

        for artist_data in top_artists_api:
            try:
                deezer_id_str = str(artist_data['id'])
                artist_local = Artist.objects.filter(deezer_id=deezer_id_str).first()

                if not artist_local or artist_local.followers == 0:
                    try:
                        full_artist_data = deezer.get_artist(artist_data['id'])
                        artist = _save_artist(full_artist_data)
                    except Exception:
                        artist = _save_artist(artist_data)
                else:
                    artist = _save_artist(artist_data)

                local_artists.append(artist)
            except Exception as e:
                print(f"Error procesando artista {artist_data.get('id')}: {e}")
                continue

        if local_artists:
            cache.set(cache_key, json.dumps([a.id for a in local_artists]), timeout=600)
            return local_artists

    except Exception as e:
        print(f"Error conectando con Deezer Charts, usando respaldo local: {e}")

    return list(Artist.objects.order_by('-followers')[:limit])

def get_top_albums(limit: int = 10) -> list:
    cache_key = f'home:top_albums:{limit}'
    cached = cache.get(cache_key)
    
    if cached:
        album_ids = json.loads(cached)
        return list(Album.objects.select_related('artist').filter(id__in=album_ids))

    try:
        top_albums_api = deezer.get_top_albums(limit=limit)
        local_albums = []

        for album_data in top_albums_api:
            try:
                with transaction.atomic():
                    artist_deezer_id = str(album_data['artist']['id'])
                    artist, _ = Artist.objects.get_or_create(
                        deezer_id=artist_deezer_id,
                        defaults={
                            'name':      album_data['artist']['name'],
                            'image_url': album_data['artist'].get('picture_medium', '')
                        }
                    )
                    album = _save_album(album_data, artist)
                    local_albums.append(album)
            except Exception as e:
                print(f"Error guardando álbum top {album_data.get('id')}: {e}")
                continue

        if local_albums:
            cache.set(cache_key, json.dumps([a.id for a in local_albums]), timeout=600)
            return local_albums

    except Exception as e:
        print(f"Error conectando con Deezer para álbumes, usando respaldo local: {e}")

    return list(Album.objects.select_related('artist').all()[:limit])