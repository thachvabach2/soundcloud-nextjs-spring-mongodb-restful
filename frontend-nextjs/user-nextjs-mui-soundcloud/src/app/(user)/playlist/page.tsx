import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hear your own playlists and the playlists you’ve liked: on SoundCloud",
    description: 'Play User and discover followers on SoundCloud | Stream tracks, albums, playlists on desktop and mobile.',
}

const PlaylistPage = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate a delay

    return (
        <div>
            playlist page
        </div>
    )
}

export default PlaylistPage;