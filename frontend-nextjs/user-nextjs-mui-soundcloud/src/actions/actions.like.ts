'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getTracksLikedByAUserAction = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: "http://localhost:8080/api/v1/likes",
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
            next: {
                tags: [`getTracksLikedByAUser`],
            },
        }
    })

    return res;
}

export const likeOrDislikeATrack = async (trackId: string, trackLikes: ITrackLike[]) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: "http://localhost:8080/api/v1/likes",
        method: "POST",
        body: {
            track: trackId,
            quantity: trackLikes?.some(t => t._id === trackId) ? -1 : 1,
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`
        }
    })

    if (res?.data) {
        revalidateTag('getTracksLikedByAUser')
    }
}