from django.conf import settings
from django.db import models
from .artist import Artist

class UserArtist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='followed_artists')
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name='followers_rel')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artist')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} sigue a {self.artist}"