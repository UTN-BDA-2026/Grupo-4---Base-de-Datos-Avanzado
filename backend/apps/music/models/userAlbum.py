from django.conf import settings
from django.db import models
from .album import Album

class UserAlbum(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='saved_albums')
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='saved_by_users')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'album')
        ordering = ['-saved_at']