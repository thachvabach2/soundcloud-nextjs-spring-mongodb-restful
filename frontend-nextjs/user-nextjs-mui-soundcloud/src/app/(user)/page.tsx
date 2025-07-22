import MainSlider from "@/components/features/main/main.slider";
import Stack from "@mui/material/Stack";
import { sendRequest } from "@/lib/utils/api";

export const dynamic = 'force-dynamic'

export default async function Home() {
    const chills = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
        method: "POST",
        body: { category: "CHILL", limit: 10 },
    })

    const workouts = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
        method: "POST",
        body: { category: "WORKOUT", limit: 10 },
    })

    const hiphop = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/top`,
        method: "POST",
        body: { category: "HIPHOP", limit: 10 },
    })

    return (
        <Stack spacing={5}>
            <MainSlider
                title={"Top Chill"}
                data={chills?.data?.result ?? []}
                totalElement={chills?.data?.meta?.totalElement ?? 0}
            />
            <MainSlider
                title={"Top Workout"}
                data={workouts?.data?.result ?? []}
                totalElement={workouts?.data?.meta?.totalElement ?? 0}
            />
            <MainSlider
                title={"Top Hiphop"}
                data={hiphop?.data?.result ?? []}
                totalElement={hiphop?.data?.meta?.totalElement ?? 0}
            />
        </Stack>
    );
}
