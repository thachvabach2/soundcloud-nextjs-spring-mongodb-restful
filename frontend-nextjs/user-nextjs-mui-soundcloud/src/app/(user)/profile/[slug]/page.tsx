import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import TrackProfile from "@/components/features/profile/profile.tracks";
import { sendRequest } from "@/lib/utils/api";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { getServerSession } from "next-auth/";
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = (await params).slug

    // get api current user here

    return {
        title: `Stream User music | Listen to songs, albums, playlists for free on SoundCloud`,
        description: `Play User Đào and discover followers on SoundCloud | Stream tracks, albums, playlists on desktop and mobile.`,
    }
}

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