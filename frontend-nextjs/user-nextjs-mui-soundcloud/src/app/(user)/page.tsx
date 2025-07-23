import MainSlider from "@/components/features/main/main.slider";
import Stack from "@mui/material/Stack";
import { getTopTrackByCategory } from "@/actions/actions.track";

// avoid pre render '/' when build
export const dynamic = 'force-dynamic'

export default async function Home() {
    const chills = await getTopTrackByCategory("CHILL", 10);
    const workouts = await getTopTrackByCategory("WORKOUT", 10);
    const hiphop = await getTopTrackByCategory("HIPHOP", 10);

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
