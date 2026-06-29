from rest_framework import serializers
from django.db.models import Sum
from .models import Playlist, PlaylistSong
from apps.music.serializers import SongSerializer

class PlaylistSearchSerializer(serializers.ModelSerializer):
    owner       = serializers.CharField(source='user.username', read_only=True)
    total_songs = serializers.SerializerMethodField()
    cover_url   = serializers.SerializerMethodField()

    class Meta:
        model  = Playlist
        fields = ['id', 'name', 'description', 'cover_url', 'is_public', 'owner', 'total_songs']

    def get_cover_url(self, obj):
        if obj.cover_url:
            return obj.cover_url
        primera_relacion = obj.playlistsong_set.order_by('position').first()
        if primera_relacion and primera_relacion.song and primera_relacion.song.album:
            return primera_relacion.song.album.cover_url or None
        return None

    def get_total_songs(self, obj):
        return obj.playlistsong_set.count()

class PlaylistSongSerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)

    class Meta:
        model  = PlaylistSong
        fields = ['id', 'song', 'position', 'added_at']


class PlaylistSerializer(serializers.ModelSerializer):
    songs          = PlaylistSongSerializer(source='playlistsong_set', many=True, read_only=True)
    owner          = serializers.CharField(source='user.username', read_only=True)
    total_songs    = serializers.SerializerMethodField()
    total_duration = serializers.SerializerMethodField()
    cover_url      = serializers.SerializerMethodField()

    class Meta:
        model  = Playlist
        fields = [
            'id', 'name', 'description', 'cover_url', 'is_public', 
            'owner', 'total_songs', 'total_duration', 'created_at', 'updated_at', 'songs'
        ]

    def get_cover_url(self, obj):
        if obj.cover_url:
            return obj.cover_url

        primera_relacion = obj.playlistsong_set.all().order_by('position').first()
        
        if primera_relacion and primera_relacion.song and primera_relacion.song.album:
            if hasattr(primera_relacion.song.album, 'cover_url') and primera_relacion.song.album.cover_url:
                return primera_relacion.song.album.cover_url

        return None

    def get_total_songs(self, obj):
        if hasattr(obj, '_prefetched_objects_cache') and 'playlistsong_set' in obj._prefetched_objects_cache:
            return len(obj.playlistsong_set.all())
        return obj.playlistsong_set.count()

    def get_total_duration(self, obj):
        result = obj.playlistsong_set.aggregate(total_ms=Sum('song__duration_ms'))
        total_ms = result.get('total_ms') or 0
        
        total_seconds = total_ms // 1000
        minutes       = total_seconds // 60
        seconds       = total_seconds % 60
        return f"{minutes} min {seconds} s"


class PlaylistCreateSerializer(serializers.ModelSerializer):
    description = serializers.CharField(required=False, allow_blank=True, default='')
    cover_url   = serializers.URLField(required=False, allow_blank=True, allow_null=True, default='')
    is_public   = serializers.BooleanField(required=False, default=False)

    class Meta:
        model  = Playlist
        fields = ['name', 'description', 'cover_url', 'is_public']