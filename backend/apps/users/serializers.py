from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.music.serializers import SongSerializer
from .models import ListeningHistory

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)
    email     = serializers.EmailField(required=True)

    class Meta:
        model  = User
        fields = ['username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ['id', 'username', 'email']


class ListeningHistorySerializer(serializers.ModelSerializer):
    song = SongSerializer(read_only=True)

    class Meta:
        model  = ListeningHistory
        fields = ['id', 'song', 'played_at']