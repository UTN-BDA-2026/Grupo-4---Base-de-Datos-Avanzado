from django.db import transaction
from ..models import Playlist, PlaylistSong
from apps.music.models import Song

def get_user_playlists(user) -> list:
    return (
        Playlist.objects
        .filter(user=user)
        .prefetch_related('playlistsong_set__song')
        .order_by('-updated_at')
    )

def get_playlist_detail(playlist_id: int, user=None) -> Playlist | None:
    try:
        playlist = Playlist.objects.prefetch_related(
            'playlistsong_set__song__artist',
            'playlistsong_set__song__album',
        ).get(id=playlist_id)
    except Playlist.DoesNotExist:
        return None

    if not playlist.is_public and playlist.user != user:
        return None

    return playlist

def create_liked_songs_playlist(user) -> Playlist:
    return Playlist.objects.create(
        name='Me gusta',
        description='Tus canciones favoritas',
        is_public=False,
        is_liked_songs=True,
        user=user,
    )

@transaction.atomic
def create_playlist(user, data: dict) -> Playlist:
    return Playlist.objects.create(
        name        = data['name'],
        description = data.get('description', ''),
        cover_url   = data.get('cover_url', ''),
        is_public   = data.get('is_public', False),
        user        = user,
    )

@transaction.atomic
def update_playlist(playlist_id: int, user, data: dict) -> dict:
    try:
        playlist = Playlist.objects.get(id=playlist_id, user=user)
    except Playlist.DoesNotExist:
        return {'error': 'Playlist no encontrada o no tenés permiso.'}

    playlist.name = data.get('name', playlist.name)
    playlist.description = data.get('description', playlist.description)
    playlist.cover_url = data.get('cover_url', playlist.cover_url)
    playlist.is_public = data.get('is_public', playlist.is_public)
    playlist.save()

    return {'success': 'Playlist actualizada correctamente.'}

@transaction.atomic
def add_song_to_playlist(playlist_id: int, song_id: int, user) -> dict:
    try:
        playlist = Playlist.objects.select_for_update().get(id=playlist_id, user=user)
    except Playlist.DoesNotExist:
        return {'error': 'Playlist no encontrada o no tenés permiso.'}

    try:
        song = Song.objects.get(id=song_id)
    except Song.DoesNotExist:
        return {'error': 'Canción no encontrada.'}

    if PlaylistSong.objects.filter(playlist=playlist, song=song).exists():
        return {'error': 'La canción ya se encuentra en esta playlist.'}

    last_position = PlaylistSong.objects.filter(playlist=playlist).count()

    PlaylistSong.objects.create(
        playlist = playlist,
        song     = song,
        position = last_position + 1,
    )

    playlist.save(update_fields=['updated_at']) 
    return {'success': f'{song.title} agregada a {playlist.name}'}

@transaction.atomic
def remove_song_from_playlist(playlist_id: int, song_id: int, user) -> dict:
    try:
        playlist = Playlist.objects.select_for_update().get(id=playlist_id, user=user)
    except Playlist.DoesNotExist:
        return {'error': 'Playlist no encontrada o no tenés permiso.'}

    deleted, _ = PlaylistSong.objects.filter(
        playlist=playlist,
        song__id=song_id
    ).delete()

    if not deleted:
        return {'error': 'La canción no está en esta playlist.'}

    songs_to_reorder = PlaylistSong.objects.filter(playlist=playlist).order_by('position')
    for index, ps in enumerate(songs_to_reorder):
        ps.position = index + 1
    
    PlaylistSong.objects.bulk_update(songs_to_reorder, ['position'])

    return {'success': 'Canción eliminada de la playlist.'}

@transaction.atomic
def delete_playlist(playlist_id: int, user) -> dict:
    try:
        playlist = Playlist.objects.get(id=playlist_id, user=user)
    except Playlist.DoesNotExist:
        return {'error': 'Playlist no encontrada o no tenés permiso.'}

    playlist.delete()
    return {'success': 'Playlist eliminada.'}