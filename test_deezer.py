# test_deezer.py
import requests

response = requests.get(
    'https://api.deezer.com/search',
    params={'q': 'Radiohead', 'limit': 3}
)

data = response.json()

for track in data['data']:
    print(f"Canción  : {track['title']}")
    print(f"Artista  : {track['artist']['name']}")
    print(f"Album    : {track['album']['title']}")
    print(f"Preview  : {track['preview']}")
    print(f"Portada  : {track['album']['cover_medium']}")
    print("---")