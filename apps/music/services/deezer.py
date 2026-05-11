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