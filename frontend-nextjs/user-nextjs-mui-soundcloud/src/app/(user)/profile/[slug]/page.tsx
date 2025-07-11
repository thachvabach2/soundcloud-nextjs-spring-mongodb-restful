import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TrackProfile from "@/components/features/profile/profile.tracks";
import { sendRequest } from "@/lib/utils/api";
import { Box, Grid } from "@mui/material";
import { getServerSession } from "next-auth";

const ProfilePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: "http://localhost:8080/api/v1/tracks/users",
        method: "POST",
        body: { id: slug },
        queryParams: {
            page: 1,
            size: 30
        }
    })
    const data = tracks?.data?.result ?? []

    return (
        <>
            <Box component={'div'} sx={{ paddingBottom: '20px' }}>
                <Grid container spacing={5}>
                    {data.map((item: ITrackTop) => {
                        return (
                            <Grid size={{ xs: 12, lg: 6 }} key={item._id}>
                                <TrackProfile track={item} />
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
        </>
    )
}

export default ProfilePage;