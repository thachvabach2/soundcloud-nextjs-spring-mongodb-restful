import { Box, Chip, Stack } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/lib/utils/api";
import { useRouter } from "next/navigation";

interface IProps {
    track: ITrackTop | null;
}

const LikeTrack = (props: IProps) => {
    const { track } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);

    useEffect(() => {
        fetchData();
    }, [session])

    const fetchData = async () => {
        if (session?.access_token) {
            const res = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL_FOR_CLIENT}/api/v1/likes`,
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
            if (res?.data?.result) {
                setTrackLikes(res?.data?.result);
            }
        }
    }

    const handleLikeTrack = async () => {
        await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL_FOR_CLIENT}/api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: trackLikes?.some(t => t._id === track?._id) ? -1 : 1,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`
            }
        })

        await sendRequest<IBackendRes<any>>({
            url: '/api/revalidate',
            method: "POST",
            queryParams: {
                tag: 'track-by-id',
                secret: "justASecretForRevalidate",
            }
        })

        fetchData();
        router.refresh();
    }

    return (
        <>
            <Stack
                className="listenEngagement__actions"
                direction={'row'}
                spacing={3}
            >
                <Chip
                    onClick={handleLikeTrack}
                    label={"Like"}
                    size="medium"
                    variant="outlined"
                    color={trackLikes?.some(t => t._id === track?._id) ? 'error' : 'default'}
                    icon={<FavoriteIcon />}
                    sx={{ borderRadius: '5px' }}
                />
                <Chip
                    label={"Add to Playlist"}
                    size="medium"
                    variant="outlined"
                    color="default"
                    icon={<PlaylistAddIcon />}
                    sx={{ borderRadius: '5px' }}
                />
            </Stack>
            <Stack
                className="listenEngagement__stats"
                direction={'row'}
                alignItems={'center'}
                spacing={3}
            >
                <Box
                    component={'span'}
                    sx={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center' }}
                >
                    <Box
                        component={'div'}
                        sx={{ display: 'inline-flex', marginRight: '5px', alignItems: 'center' }}
                    >
                        <PlayArrowIcon sx={{ fontSize: '20px' }} />
                    </Box>
                    <Box component={'span'}>{track?.countPlay}</Box>
                </Box>
                <Box
                    component={'span'}
                    style={{ color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center' }}
                >
                    <Box
                        sx={{ display: 'inline-flex', marginRight: '5px', alignItems: 'center' }}
                    >
                        <FavoriteIcon sx={{ fontSize: '15px' }} />
                    </Box>
                    <Box component={'span'}>{track?.countLike}</Box>
                </Box>
            </Stack>
        </>
    )
}

export default LikeTrack;