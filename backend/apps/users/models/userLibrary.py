from django.db import models
from django.conf import settings

class UserLibrary(models.Model):
    user     = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    song     = models.ForeignKey('music.Song', on_delete=models.CASCADE)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Biblioteca de Usuario"
        verbose_name_plural = "Bibliotecas de Usuarios"
        unique_together = [['user', 'song']]

    def __str__(self):
        return f"{self.user.username} - {self.song.id}"