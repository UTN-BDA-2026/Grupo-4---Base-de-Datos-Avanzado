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
        ]

class ArtistMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = ['deezer_id', 'name', 'image_url']

class AlbumSerializer(serializers.ModelSerializer):
    artist = ArtistMinimalSerializer(read_only=True)

    class Meta:
        model  = Album
        fields = [
            'deezer_id',
            'name',
            'cover_url',
            'release_date',
            'album_type',
            'total_tracks',
            'popularity',
            'artist',
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

class TopArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artist
        fields = [
            'deezer_id',
            'name',
            'image_url',
            'followers',
        ]

class TopAlbumSerializer(serializers.ModelSerializer):
    artist = ArtistMinimalSerializer(read_only=True)

    class Meta:
        model = Album
        fields = [
            'deezer_id',
            'name',
            'cover_url',
            'release_date',
            'album_type',
            'artist',
            'popularity',  
        ]