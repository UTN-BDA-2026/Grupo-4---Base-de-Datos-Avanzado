
from django.db import transaction
from ..models import ListeningHistory
from apps.music.models import Song

@transaction.atomic
def register_play(user, song_id: int) -> dict:
    try:
        song = Song.objects.get(id=song_id)
    except Song.DoesNotExist:
        return {'error': 'Canción no encontrada.'}

    ListeningHistory.objects.create(
        user=user,
        song=song,
    )
    return {'success': f'Reproducción de {song.title} registrada.'}


def get_listening_history(user, limit: int = 20) -> list:
    return (
        ListeningHistory.objects
        .select_related('song__artist', 'song__album')
        .filter(user=user)
        .order_by('-played_at')[:limit]
    )


def get_recently_played(user, limit: int = 10) -> list:
    history = (
        ListeningHistory.objects
        .select_related('song__artist', 'song__album')
        .filter(user=user)
        .order_by('-played_at')
    )

    seen    = set()
    songs   = []
    for entry in history:
        if entry.song_id not in seen:
            seen.add(entry.song_id)
            songs.append(entry.song)
        if len(songs) >= limit:
            break

    return songs