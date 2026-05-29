from django.urls import path
from ....apps.music import views

urlpatterns = [
    path('search/',                          views.song_search,    name='song-search'),
    path('songs/<str:deezer_id>/',           views.song_detail,    name='song-detail'),
    path('top/',                             views.top_songs,      name='top-songs'),
    path('artists/top/',                     views.top_artists,    name='top-artists'),
    path('artists/<str:deezer_id>/',         views.artist_detail,  name='artist-detail'),
    path('artists/<str:deezer_id>/songs/',   views.artist_songs,   name='artist-songs'),
    path('artists/<str:deezer_id>/albums/',  views.artist_albums,  name='artist-albums'),
]