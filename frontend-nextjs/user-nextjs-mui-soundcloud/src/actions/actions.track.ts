'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { sendRequest } from "@/lib/utils/api"
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
            next: {
                tags: [`getTrackById`],
            },
        }
    })

    return res;
}

export const increaseCountPlay = async (trackId: string) => {
    await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
        method: "POST",
        body: {
            trackId: trackId
        }
    })
    revalidateTag('getTrackById');
}
