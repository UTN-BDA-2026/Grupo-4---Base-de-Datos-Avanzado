from django.db import models
from django.conf import settings

class Playlist(models.Model):
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    cover_url   = models.URLField(blank=True)
    is_public   = models.BooleanField(default=False)
    is_liked_songs = models.BooleanField(default=False)
    
    user        = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='playlists'
    )
    
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    
    songs       = models.ManyToManyField(
        'music.Song', 
        through='PlaylistSong', 
        blank=True,
        related_name='playlists'
    )


    class Meta:
        indexes = [
            models.Index(fields=['user', 'is_public']),   
            models.Index(fields=['user', 'updated_at']),  
            models.Index(fields=['name']),                
        ]
        constraints = [
            # Un solo "Me gusta" por usuario
            models.UniqueConstraint(
                fields=['user'],
                condition=models.Q(is_liked_songs=True),
                name='unique_liked_songs_playlist_per_user'
            )
        ]
    
    def __str__(self):
        return self.name

class PlaylistSong(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    # Referencia cruzada a la app 'music'
    song     = models.ForeignKey('music.Song', on_delete=models.CASCADE)
    position = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['playlist', 'song']]  #(crea índice implícito)
        indexes = [
            models.Index(fields=['playlist', 'position']), 
        ]

    def __str__(self):
        return f"{self.playlist.name} - {self.song.id} (Pos: {self.position})"