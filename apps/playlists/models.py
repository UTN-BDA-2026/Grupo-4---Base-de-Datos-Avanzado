from django.db import models
from django.conf import settings

class Playlist(models.Model):
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover_url   = models.URLField(blank=True)
    is_public   = models.BooleanField(default=False)
    
    # Referencia al modelo de usuario definido en settings
    user        = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='playlists'
    )
    
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    
    # Referencia cruzada a la app 'music'
    songs       = models.ManyToManyField(
        'music.Song', 
        through='PlaylistSong', 
        blank=True,
        related_name='playlists'
    )

    def __str__(self):
        return self.name

class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    # Referencia cruzada a la app 'music'
    song     = models.ForeignKey('music.Song', on_delete=models.CASCADE)
    position = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['position']
        # Clave compuesta para evitar duplicados exactos
        unique_together = [['playlist', 'song']]

    def __str__(self):
        return f"{self.playlist.name} - {self.song.id} (Pos: {self.position})"