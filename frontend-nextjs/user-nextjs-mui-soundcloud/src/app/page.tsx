import MainSlider from "@/components/main/main.slider";
import { Stack } from "@mui/material";

export default function Home() {
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
