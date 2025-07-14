import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "SoundCloud",
        "short_name": "SoundCloud",
        "description": "SoundCloud Web",
        "icons": [
            {
                "src": "https://open.spotifycdn.com/cdn/images/icons/Spotify_16.0689c81c.png",
                "type": "image/png",
                "sizes": "16x16"
            },
            {
                "src": "https://open.spotifycdn.com/cdn/images/icons/Spotify_32.581ad6d0.png",
                "type": "image/png",
                "sizes": "32x32"
            },
            {
                "src": "https://open.spotifycdn.com/cdn/images/icons/Spotify_128.45316d66.png",
                "type": "image/png",
                "sizes": "128x128"
            },
            {
                "src": "https://open.spotifycdn.com/cdn/images/icons/Spotify_256.17e41e58.png",
                "type": "image/png",
                "sizes": "256x256"
            },
            {
                "src": "https://open.spotifycdn.com/cdn/images/icons/Spotify_512.7e07796d.png",
                "type": "image/png",
                "sizes": "512x512"
            },
            {
                "src": "https://open.spotifycdn.com/cdn/images/icons/Spotify_1024.31b25879.png",
                "type": "image/png",
                "sizes": "1024x1024"
            }
        ],
        "theme_color": "#121212",
        "background_color": "#121212",
        "start_url": "/",
        "scope": "https://open.spotify.com/",
        "display": "standalone",
    }
}