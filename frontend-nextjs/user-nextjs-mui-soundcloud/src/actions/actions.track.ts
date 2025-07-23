'use server'

import { INewTrack, ITrackForm } from "@/components/features/track/upload/steps/step2";
import { authOptions } from "@/lib/auth/auth";
import { sendRequest, sendRequestFile } from "@/lib/utils/api"
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getTrackByIdAction = async (id: string) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
        headers: {
            'Authorization': `Bearer ${session?.access_token}`,
        },
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

    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
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