'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";


export const getCommentsByATrackAction = async (trackId: string) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        headers: {
            'Authorization': `Bearer ${session?.access_token}`,
        },
        queryParams: {
            page: 1,
            size: 10,
            sort: 'createdAt,desc',
            trackId: trackId,
        },
        nextOption: {
            next: {
                tags: [`getCommentsByATrack`]
            },
        }
    })

    return res;
}

export const createACommentOnATrackAction = async (content: string, moment: number, track: string) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<ITrackComment>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
        method: "POST",
        body: { content, moment, track },
        headers: {
            'Authorization': `Bearer ${session?.access_token}`,
        },
    })

    if (res?.data) {
        revalidateTag(`getCommentsByATrack`);
    }

    return res;
}