from django.db import models
from .artist import Artist

class Album(models.Model):
    deezer_id   = models.CharField(max_length=100, unique=True)
    name         = models.CharField(max_length=200)
    cover_url    = models.URLField(blank=True)
    release_date = models.CharField(max_length=20)
    album_type   = models.CharField(max_length=50) 
    total_tracks = models.IntegerField(default=0)
    
    artist = models.ForeignKey(
        Artist, 
        on_delete=models.CASCADE, 
        related_name='albums'
    )

    class Meta:
        indexes = [
            models.Index(fields=['name']),            
            models.Index(fields=['release_date']),      
            models.Index(fields=['artist', 'release_date']), 
            models.Index(fields=['album_type', 'release_date']),  
        ]

    def __str__(self):
        return self.name