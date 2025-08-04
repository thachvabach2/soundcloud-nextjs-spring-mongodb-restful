'use server'

import { authOptions } from "@/lib/auth/auth";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getTracksLikedByAUserAction = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: {
            page: 1,
            size: 100,
            sort: 'createdAt,desc'
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`
        },
        nextOption: {
            cache: 'force-cache',
            next: {
                tags: [`getTracksLikedByAUser`],
            },
        }
    })

    return res;
}

export const likeOrDislikeATrack = async (trackId: string, quantity: number) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "POST",
        body: {
            track: trackId,
            quantity: quantity,
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`
        }
    })

    if (res?.data) {
        revalidateTag('getTracksLikedByAUser');
        revalidateTag('track-by-id');
    }

    return res;
}