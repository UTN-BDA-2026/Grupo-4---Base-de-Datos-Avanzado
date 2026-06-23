import requests

DEEZER_BASE_URL = 'https://api.deezer.com'

def search_tracks(query: str, limit: int = 20) -> list:
    response = requests.get(
        f'{DEEZER_BASE_URL}/search',
        params={'q': query, 'limit': limit}
    )
    response.raise_for_status()
    return response.json().get('data', [])

def get_artist(deezer_artist_id: int) -> dict:
    response = requests.get(f'{DEEZER_BASE_URL}/artist/{deezer_artist_id}')
    response.raise_for_status()
    return response.json()

def get_album(deezer_album_id: int) -> dict:
    response = requests.get(f'{DEEZER_BASE_URL}/album/{deezer_album_id}')
    response.raise_for_status()
    return response.json()

def get_track(deezer_track_id: int) -> dict:
    response = requests.get(f'{DEEZER_BASE_URL}/track/{deezer_track_id}')
    response.raise_for_status()
    return response.json()


def get_top_artists(limit: int = 20) -> list:
    response = requests.get(f'{DEEZER_BASE_URL}/chart/0/artists', params={'limit': limit})
    response.raise_for_status()
    return response.json().get('data', [])

def get_top_albums(limit: int = 20) -> list:
    response = requests.get(f'{DEEZER_BASE_URL}/chart/0/albums', params={'limit': limit})
    response.raise_for_status()
    return response.json().get('data', [])

def get_artist_top_tracks(deezer_artist_id: int, limit: int = 20) -> list:
    response = requests.get(
        f'{DEEZER_BASE_URL}/artist/{deezer_artist_id}/top',
        params={'limit': limit}
    )
    response.raise_for_status()
    return response.json().get('data', [])

def get_artist_albums(deezer_artist_id: int, limit: int = 25) -> list:
    response = requests.get(
        f'{DEEZER_BASE_URL}/artist/{deezer_artist_id}/albums',
        params={'limit': limit}
    )
    response.raise_for_status()
    return response.json().get('data', [])

def get_album_tracks(deezer_album_id: int, limit: int = 100) -> list:
    response = requests.get(
        f'{DEEZER_BASE_URL}/album/{deezer_album_id}/tracks',
        params={'limit': limit}
    )
    response.raise_for_status()
    return response.json().get('data', [])