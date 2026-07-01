
from django.db import transaction
from django.utils import timezone
from ..models import ListeningHistory
from apps.music.models import Song, Artist
from django.db.models import Count

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


def get_recently_played(user, limit: int = 20) -> list:
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


from django.db.models import Count

def get_top_artists_month(user, limit: int = 5) -> list:
    start_of_month = timezone.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    # Usamos __artist para navegar de ListeningHistory -> Song -> Artist
    top = (
        ListeningHistory.objects
        .filter(user=user, played_at__gte=start_of_month)
        .values('song__artist__id') # Asegúrate de pedir el ID del artista
        .annotate(play_count=Count('id'))
        .order_by('-play_count')[:limit]
    )

    # Extraemos los IDs
    artist_ids = [row['song__artist__id'] for row in top]
    
    # Recuperamos los objetos Artista
    artists = Artist.objects.in_bulk(artist_ids)
    
    # Ordenamos los resultados según el orden del top
    return [artists[row['song__artist__id']] for row in top if row['song__artist__id'] in artists]

def get_top_songs_by_user(user, limit: int = 10) -> list:
    from django.db.models import Count
    top = (
        ListeningHistory.objects
        .filter(user=user)
        .values('song')
        .annotate(play_count=Count('id'))
        .order_by('-play_count')[:limit]
    )
    song_ids = [row['song'] for row in top]
    songs = Song.objects.select_related('artist', 'album').in_bulk(song_ids)
    return [songs[row['song']] for row in top if row['song'] in songs]