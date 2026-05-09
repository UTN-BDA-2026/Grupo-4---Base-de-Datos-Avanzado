from django.db import models

class Artist(models.Model):
    spotify_id = models.CharField(max_length=100, unique=True)
    
    name = models.CharField(max_length=200)
    image_url = models.URLField(blank=True)
    
    genres = models.JSONField(default=list)
    followers = models.IntegerField(default=0)
    popularity = models.IntegerField(default=0)
    
    fetched_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Artista"
        verbose_name_plural = "Artistas"
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['popularity']),
    ]

    def __str__(self):
        return self.name