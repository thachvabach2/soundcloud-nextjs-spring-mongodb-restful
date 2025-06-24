'use client'

import WaveTrack from "@/components/features/track/wave.track";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = (props: any) => {
    const { params } = props;

    const searchParams = useSearchParams()

    const search = searchParams.get('audio')


    // console.log('>>>> check search: ', search)
    return (
        <div className="content">
            <WaveTrack />
        </div>
    )
}

export default DetailTrackPage;