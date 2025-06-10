import MainSlider from "@/components/main/main.slider";
import { Stack } from "@mui/material";
import { sendRequest } from "@/utils/api";

export default async function Home() {
    const res = await sendRequest<IBackendRes<ITrackTop[]>>({
        url: "http://localhost:8080/api/v1/tracks/top",
        method: "POST",
        body: {
            category: "HIPHOP",
            limit: 1
        }
    })

    console.log('>>> check rs TS', res.data);

    return (
        <Stack
            spacing={5}
            sx={{
                paddingTop: '24px',
                paddingBottom: '60px'
            }}
        >
            <MainSlider />
            <MainSlider />
            <MainSlider />
        </Stack>
    );
}
