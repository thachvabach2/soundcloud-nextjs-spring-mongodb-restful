import { getPlaylistByIdAction } from "@/actions/actions.playlist";
import PlaylistDetailHeader from "@/components/features/playlist/slug/playlist.detail.header";
import PlaylistDetailListTrack from "@/components/features/playlist/slug/playlist.detail.list.track";
import { notFound } from "next/navigation";

const DetailPlaylistPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug: playlistId } = await params;

    const resPlaylist = await getPlaylistByIdAction(playlistId);

    if (!resPlaylist?.data) {
        notFound();
    }

    return (
        <>
            <PlaylistDetailHeader
                playlist={resPlaylist?.data}
            />
            <PlaylistDetailListTrack
                playlist={resPlaylist?.data}
            />
        </>
    )
}

export default DetailPlaylistPage;