'use server'

import { authOptions } from "@/lib/auth/auth";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth";

export const getNotificationsByAUserWithPaginationAction = async () => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginate<INotification>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/notifications`,
        method: "GET",
        queryParams: {
            page: 1,
            size: 100,
            sort: 'createdAt,desc'
        },
        headers: {
            Authorization: `Bearer ${session?.access_token}`
        },
    })

    return res;
}