import { getCommentsByATrackAction } from "@/actions/actions.comment";
import { getTracksLikedByAUserAction } from "@/actions/actions.like";
import { getTrackByIdAction } from "@/actions/actions.track";
import WaveTrack from "@/components/features/track/wave.track";
import { createTrackSchema } from "@/lib/utils/schemas";
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from "next/navigation";
import Script from "next/script";

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    const extractTrackId = (slug: string): string | null => {
        const withoutExtension = slug.replace('.html', '');

        const parts = withoutExtension.split('-');
        const trackId = parts[parts.length - 1];

        if (trackId && /^[a-f\d]{24}$/i.test(trackId)) {
            return trackId;
        }

        return null;
    };

    const trackId = extractTrackId(slug);
    if (!trackId) {
        notFound();
    }
    const track = await getTrackByIdAction(trackId);

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
    const { slug } = await params;

    const extractTrackId = (slug: string): string | null => {
        const withoutExtension = slug.replace('.html', '');

        const parts = withoutExtension.split('-');
        const trackId = parts[parts.length - 1];

        if (trackId && /^[a-f\d]{24}$/i.test(trackId)) {
            return trackId;
        }

        return null;
    };

    const trackId = extractTrackId(slug);
    if (!trackId) {
        notFound();
    }

    const res = await getTrackByIdAction(trackId);
    const resAllComments = await getCommentsByATrackAction(trackId);
    const resGetTracksLikedByAUser = await getTracksLikedByAUserAction();

    if (!res?.data) {
        notFound();
    }
    return (
        <div className="content">
            <WaveTrack
                track={res?.data ?? null}
                listComment={resAllComments?.data ?? null}
                listTrackLikedByAUser={resGetTracksLikedByAUser?.data ?? null}
            />
            <Script
                id={`track-schema-${trackId}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(createTrackSchema(res?.data ?? null))
                }}
            />
        </div>
    )
}

export default DetailTrackPage;