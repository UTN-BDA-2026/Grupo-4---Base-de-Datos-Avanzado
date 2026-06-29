from rest_framework import serializers
from .models import Artist, Album, Song, UserAlbum , UserArtist

class ArtistSerializer(serializers.ModelSerializer):
    is_following = serializers.SerializerMethodField()

    class Meta:
        model  = Artist
        fields = [
            'deezer_id',
            'name',
            'image_url',
            'genres',
            'followers',
            'is_following',
        ]

    def get_is_following(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return UserArtist.objects.filter(user=request.user, artist=obj).exists()

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

class UserAlbumSerializer(serializers.ModelSerializer):
    album = AlbumSerializer(read_only=True)

    class Meta:
        model = UserAlbum
        fields = ['id', 'album']


class UserArtistSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)

    class Meta:
        model = UserArtist
        fields = ['artist', 'created_at']