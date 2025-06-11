'use client'

import { useSearchParams } from "next/navigation";

const DetailTrackPage = (props: any) => {
    const { params } = props;

    const searchParams = useSearchParams()

    const search = searchParams.get('audio')


    console.log('>>>> check search: ', search)
    return (
        <div>
            detail track page
        </div>
    )
}

export default DetailTrackPage;