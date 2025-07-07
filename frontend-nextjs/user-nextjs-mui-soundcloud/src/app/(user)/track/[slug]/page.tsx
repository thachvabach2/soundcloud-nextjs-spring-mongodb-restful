import { handleGetTrackByIdAction } from "@/actions/actions";
import WaveTrack from "@/components/features/track/wave.track";

const DetailTrackPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug: trackId } = await params;

    const res = await handleGetTrackByIdAction(trackId);
    return (
        <div className="content">
            <WaveTrack
                track={res?.data ?? null}
            />
        </div>
    )
}

export default DetailTrackPage;