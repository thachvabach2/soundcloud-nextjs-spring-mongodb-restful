'use server'

import { authOptions } from "@/lib/auth/auth";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getUserPlaylistAction = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
        method: "POST",
        headers: {
            'Authorization': `Bearer ${session?.access_token}`,
        },
        queryParams: {
            page: 1,
            size: 100,
            sort: 'createdAt,desc',
            isJoin: true,
        },
        nextOption: {
            cache: 'force-cache',
            next: {
                tags: [`getUserPlaylist-${session?.user?._id}`]
            }
        }
    })

    return res;
}

export const getPlaylistByIdAction = async (playlistId: string) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IPlaylist>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/${playlistId}`,
        method: "GET",
        headers: {
            'Authorization': `Bearer ${session?.access_token}`,
        },
    })

    return res;
}

export const createEmptyPlaylistAction = async (title: string, isPublic: boolean) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
        method: "POST",
        headers: {
            'Authorization': `Bearer ${session?.access_token}`,
        },
        body: {
            title, isPublic
        }
    })

    if (res.data) {
        revalidateTag(`getUserPlaylist-${session?.user._id}`)
    }

    return res;
}