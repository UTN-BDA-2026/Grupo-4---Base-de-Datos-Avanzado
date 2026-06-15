from rest_framework import serializers
from .models import Artist, Album, Song

class ArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Artist
        fields = [
            'deezer_id',
            'name',
            'image_url',
            'genres',
            'followers',
            'popularity',
        ]

class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Album
        fields = [
            'deezer_id',
            'name',
            'cover_url',
            'release_date',
            'album_type',
            'total_tracks',
        ]

class SongSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    album  = AlbumSerializer(read_only=True)

    class Meta:
        model  = Song
        fields = [
            'id',
            'deezer_id',
            'title',
            'duration_ms',
            'track_number',
            'popularity',
            'preview_url',
            'artist',
            'album',
        ]