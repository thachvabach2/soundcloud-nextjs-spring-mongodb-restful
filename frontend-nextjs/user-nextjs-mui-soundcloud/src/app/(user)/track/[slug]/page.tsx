import { getCommentsByATrackAction } from "@/actions/actions.comment";
import { getTrackByIdAction } from "@/actions/actions.track";
import WaveTrack from "@/components/features/track/wave.track";

const DetailTrackPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug: trackId } = await params;

    const res = await getTrackByIdAction(trackId);
    const resAllComments = await getCommentsByATrackAction(trackId);
    return (
        <div className="content">
            <WaveTrack
                track={res?.data ?? null}
                listComment={resAllComments?.data ?? null}
            />
        </div>
    )
}

export default DetailTrackPage;