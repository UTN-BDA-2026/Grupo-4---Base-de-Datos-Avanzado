from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register,     name='register'),
    path('login/',    views.login_view,   name='login'),
    path('logout/',   views.logout_view,  name='logout'),
    path('profile/',  views.profile,      name='profile'),
    path('history/',          views.listening_history,  name='history'),
    path('history/add/',      views.add_to_history,     name='add-history'),
    path('recently-played/',  views.recently_played,    name='recently-played'),
    path('artists/top-month/', views.top_artists_month, name='top-artists-month'),
    path('songs/top/', views.top_songs_by_user, name='top-songs-by-user'),
]