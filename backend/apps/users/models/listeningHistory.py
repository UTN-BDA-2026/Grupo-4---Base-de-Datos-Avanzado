from django.db import models
from django.conf import settings

class ListeningHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listening_history',
        db_constraint=False,
    )

    song = models.ForeignKey(
        'music.Song',
        on_delete=models.CASCADE,
        related_name='listened_by',
        db_constraint=False,
    )

    played_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-played_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['song']),
            models.Index(fields=['played_at']),
            models.Index(fields=['user', 'played_at']),
            models.Index(fields=['song', 'user']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.song.title}"