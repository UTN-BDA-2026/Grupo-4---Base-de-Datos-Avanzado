from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/music/', include('apps.music.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/playlists/', include('apps.playlists.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]