from django.urls import path
from . import views

urlpatterns = [
    path('', views.playlists, name='playlists'),
    path('<int:playlist_id>/', views.playlist_detail, name='playlist-detail'),
    path('<int:playlist_id>/songs/', views.playlist_songs, name='playlist-songs'),
    path('<int:playlist_id>/songs/<int:song_id>/', views.playlist_songs, name='playlist-songs-detail'),
]