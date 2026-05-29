from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from .models import Playlist


@login_required
def create_playlist(request):

    if request.method == 'POST':

        name = request.POST.get('name')
        description = request.POST.get('description')

        Playlist.objects.create(
            name=name,
            description=description,
            user=request.user
        )

        return redirect('my_playlists')

    return render(request, 'playlists/create_playlist.html')


@login_required
def my_playlists(request):

    playlists = request.user.playlists.all()

    return render(
        request,
        'playlists/my_playlists.html',
        {'playlists': playlists}
    )