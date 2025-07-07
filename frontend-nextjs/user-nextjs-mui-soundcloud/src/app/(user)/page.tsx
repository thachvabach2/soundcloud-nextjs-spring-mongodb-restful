import MainSlider from "@/components/features/main/main.slider";
import { Stack } from "@mui/material";
import { sendRequest } from "@/lib/utils/api";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
    const session = await getServerSession(authOptions);

    const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8080/api/v1/tracks/top",
        method: "POST",
        body: { category: "CHILL", limit: 10 },
    })

    const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8080/api/v1/tracks/top",
        method: "POST",
        body: { category: "WORKOUT", limit: 10 },
    })

    const hiphop = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8080/api/v1/tracks/top",
        method: "POST",
        body: { category: "HIPHOP", limit: 10 },
    })

    return (
        <Stack spacing={5}>
            <MainSlider
                title={"Top Chill"}
                data={chills?.data ?? []}
            />
            <MainSlider
                title={"Top Workout"}
                data={workouts?.data ?? []}
            />
            <MainSlider
                title={"Top Hiphop"}
                data={hiphop?.data ?? []}
            />
        </Stack>
    );
}
