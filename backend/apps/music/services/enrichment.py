import logging
from . import deezer
from ..models import Artist, Album

logger = logging.getLogger(__name__)


def ensure_artist_complete(artist: Artist, save_artist_fn) -> Artist:
    """Si el artista tiene datos incompletos (followers=0), refresca con el detalle completo de Deezer."""
    if artist.followers == 0:
        try:
            return save_artist_fn(deezer.get_artist(artist.deezer_id))
        except Exception as e:
            logger.warning(f"No se pudo completar artista {artist.deezer_id} ({artist.name}): {e}")
    return artist


def ensure_album_complete(album: Album, save_album_fn) -> Album:
    """Si el álbum tiene datos incompletos (total_tracks=0 o sin release_date), refresca con el detalle completo de Deezer."""
    if album.total_tracks == 0 or not album.release_date:
        try:
            return save_album_fn(deezer.get_album(album.deezer_id), album.artist)
        except Exception as e:
            logger.warning(f"No se pudo completar álbum {album.deezer_id} ({album.name}): {e}")
    return album