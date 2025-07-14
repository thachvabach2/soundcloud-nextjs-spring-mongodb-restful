import { getCommentsByATrackAction } from "@/actions/actions.comment";
import { getTracksLikedByAUserAction } from "@/actions/actions.like";
import { getTrackByIdAction } from "@/actions/actions.track";
import WaveTrack from "@/components/features/track/wave.track";

import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    const track = await getTrackByIdAction(slug);

    return {
        title: `${track.data?.title} • ${track.data?.artist}`,
        description: `Listen to ${track.data?.title} on SoundCloud · ${track.data?.artist}`,
        openGraph: {
            title: "title",
            description: "description",
            type: 'website',
            images: [`https://github.com/thachvabach2/sharing-host-files/blob/main/soundcloud/muon.jpg?raw=true`]
        }
    }
}

const DetailTrackPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug: trackId } = await params;

    const res = await getTrackByIdAction(trackId);
    const resAllComments = await getCommentsByATrackAction(trackId);
    const resGetTracksLikedByAUser = await getTracksLikedByAUserAction();
    return (
        <div className="content">
            <WaveTrack
                track={res?.data ?? null}
                listComment={resAllComments?.data ?? null}
                listTrackLikedByAUser={resGetTracksLikedByAUser?.data ?? null}
            />
        </div>
    )
}

export default DetailTrackPage;