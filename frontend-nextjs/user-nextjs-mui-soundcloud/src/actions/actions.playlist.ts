'use server'

import { authOptions } from "@/lib/auth/auth";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth";

export const getUserPlaylist = async () => {
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
    })

    return res;
}

export const getPlaylistById = async (playlistId: string) => {
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