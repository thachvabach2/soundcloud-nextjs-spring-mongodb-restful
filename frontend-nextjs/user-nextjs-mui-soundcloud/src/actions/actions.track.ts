'use server'

import { INewTrack, ITrackForm } from "@/components/features/track/upload/steps/step2";
import { authOptions } from "@/lib/auth/auth";
import { sendRequest, sendRequestFile } from "@/lib/utils/api"
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getTrackByIdAction = async (id: string) => {

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
        nextOption: {
            cache: 'force-cache',
            next: {
                tags: [`getTrackById-${id}`],
            },
        }
    })

    return res;
}

export const increaseCountPlay = async (trackId: string) => {
    await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
        method: "POST",
        body: {
            trackId: trackId
        }
    })
    revalidateTag(`getTrackById-${trackId}`);
}

export const uploadFileAction = async (formData: FormData, targetType: string) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequestFile<IBackendRes<IUpload>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/files/upload`,
        method: "POST",
        body: formData,
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'target_type': targetType,
        },
    })

    return res;
}

export const createANewTrackAfterUploadAction = async (data: ITrackForm, info: INewTrack) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
        method: "POST",
        body: {
            title: data.title,
            artist: data.artist,
            description: data.description,
            trackUrl: info.trackUrl,
            imgUrl: info.imgUrl,
            category: data.category
        },
        headers: {
            'Authorization': `Bearer ${session?.access_token}`,
        },
    })

    if (res?.data) {
        revalidateTag(`getTopTrackByCategory-${data.category}`);
        revalidateTag(`getTracksCreatedByAUser-by-profile-${res.data.uploader?._id}`);
    }

    return res;
}

export const getTopTrackByCategory = async (category: string, limit: number) => {
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
        method: "POST",
        body: { category: category, limit: limit },
        nextOption: {
            cache: 'force-cache',
            next: {
                tags: [`getTopTrackByCategory-${category}`],
            },
        }
    })

    return res;
}

export const getTracksCreatedByAUserAction = async (userId: string) => {
    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users`,
        method: "POST",
        body: { id: userId },
        queryParams: {
            page: 1,
            size: 30
        },
        nextOption: {
            cache: 'force-cache',
            next: {
                tags: [`getTracksCreatedByAUser-by-profile-${userId}`],
            }
        }
    })

    return tracks;
}

export const searchTracksWithName = async (title: string) => {

    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
        method: "POST",
        body: { title },
        queryParams: {
            page: 1,
            size: 30
        }
    })

    return res;
}