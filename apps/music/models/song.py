from django.db import models
from .artist import Artist
from .album import Album

class Song(models.Model):
    spotify_id   = models.CharField(max_length=100, unique=True)
    title        = models.CharField(max_length=200)
    duration_ms  = models.IntegerField()
    track_number = models.IntegerField(default=1)
    popularity   = models.IntegerField(default=0)
    preview_url  = models.URLField(blank=True)
    
    artist = models.ForeignKey(
        Artist, 
        on_delete=models.CASCADE, 
        related_name='songs'
    )
    album = models.ForeignKey(
        Album, 
        on_delete=models.CASCADE, 
        related_name='songs'
    )

    class Meta:
        indexes = [
            models.Index(fields=['title']),
            models.Index(fields=['popularity']),
        ]

    def __str__(self):
        return self.title