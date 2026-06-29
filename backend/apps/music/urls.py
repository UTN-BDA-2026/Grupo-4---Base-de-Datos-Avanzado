from django.urls import path
from . import views

urlpatterns = [
    path('search/',                          views.song_search,       name='song-search'),
    path('songs/<str:deezer_id>/',           views.song_detail,       name='song-detail'),
    path('top/',                             views.top_songs,         name='top-songs'),
    path('artists/top/',                     views.top_artists,       name='top-artists'),
    path('albums/top/',                      views.top_albums,        name='top-albums'), 
    path('artists/followed/',                views.user_followed_artists, name='user-followed-artists'), 
    path('artists/<str:deezer_id>/',         views.artist_detail,     name='artist-detail'),
    path('artists/<str:deezer_id>/songs/',   views.artist_songs,      name='artist-songs'),
    path('artists/<str:deezer_id>/albums/',  views.artist_albums,     name='artist-albums'),
    path('artists/<str:deezer_id>/follow/',  views.toggle_follow_artist, name='toggle-follow-artist'),
    path('albums/<str:deezer_id>/',          views.album_detail,      name='album-detail'),
    path('albums/<str:deezer_id>/songs/',    views.album_songs,       name='album-songs'),
    path('albums/<str:deezer_id>/toggle-save/', views.toggle_save_album, name='toggle-save-album'),
    path('users/me/albums/',                 views.user_saved_albums, name='user-saved-albums'),
]