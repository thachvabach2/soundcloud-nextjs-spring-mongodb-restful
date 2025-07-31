
import WaveTrack from "@/components/features/track/wave.track";
import { sendRequest } from "@/lib/utils/api";
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
    const track = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${trackId}`,
        method: "GET",
    });

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

// getServerSession không generate được SSG (file html)
// cache = no-store không generate được SSG (file html)
// ssg sẽ tự tạo .html khác khi ở viewport (-> server tốn tài nguyên -> cân nhắc dùng SSG: chưa chắc)
// chỉ nên dùng ssg: static page or route có ít slug.
export async function generateStaticParams() {
    return [
        { slug: "muon-686bb31ae010187e44dffc64.html" },
        { slug: "loi-duong-mat-6870e27f1de07742f3112438.html" },
        { slug: "tai-sinh-6875595de0bd6f2e767c4b28.html" },
    ]
}

const DetailTrackPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;

    const extractTrackId = (slug: string) => {
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

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${trackId}`,
        method: "GET",
        nextOption: {
            cache: 'force-cache',
            next: { tags: ['track-by-id'] }
        }
    })

    const resAllComments = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            page: 1,
            size: 10,
            sort: 'createdAt,desc',
            trackId: trackId,
        },
        nextOption: {
            cache: 'force-cache',
            next: {
                tags: [`getCommentsByATrack-${trackId}`],
            },
        }
    })

    // nguyên nhân lỗi không build được SSG (file .html) do dùng getSessionServer (SSR) -> lỗi
    // Giải pháp: Gọi api ở client component 
    // const resGetTracksLikedByAUser = await getTracksLikedByAUserAction();

    // await new Promise(resolve => setTimeout(resolve, 10000));

    if (!res?.data) {
        notFound();
    }

    return (
        <div className="content">
            <WaveTrack
                track={res?.data ?? null}
                listComment={resAllComments?.data ?? null}
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