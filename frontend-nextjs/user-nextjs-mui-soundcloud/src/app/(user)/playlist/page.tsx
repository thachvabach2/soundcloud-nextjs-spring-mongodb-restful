import { getUserPlaylist } from "@/actions/actions.playlist";
import PlaylistTrack from "@/components/features/playlist/playlist.track";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Hear your own playlists and the playlists you’ve liked: on SoundCloud",
    description: 'Play User and discover followers on SoundCloud | Stream tracks, albums, playlists on desktop and mobile.',
}

const PlaylistPage = async () => {
    const playlists = await getUserPlaylist();

    if (!playlists?.data) {
        notFound();
    }

    return (
        <>
            <PlaylistTrack
                playlists={playlists?.data?.result}
            />
        </>
    )
}

export default PlaylistPage;