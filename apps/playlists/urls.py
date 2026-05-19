from django.urls import path
from . import views

urlpatterns = [

    path(
        'create/',
        views.create_playlist,
        name='create_playlist'
    ),

    path(
        'my/',
        views.my_playlists,
        name='my_playlists'
    ),
]