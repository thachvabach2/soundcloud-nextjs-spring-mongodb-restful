import { getTracksLikedByAUserAction } from "@/actions/actions.like";
import LikeTrackContainer from "@/components/features/like/like.track.container";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: "Here the tracks you've liked: on SoundCloud",
    description: 'Discover and play songs, tracks and music playlists by genre and popularity on SoundCloud desktop and mobile.',
}

const LikePage = async () => {
    const tracksLiked = await getTracksLikedByAUserAction();

    if (!tracksLiked?.data?.result) {
        notFound();
    }

    return (
        <>
            <LikeTrackContainer
                tracksLiked={tracksLiked?.data?.result}
            />
        </>
    )
}

export default LikePage;