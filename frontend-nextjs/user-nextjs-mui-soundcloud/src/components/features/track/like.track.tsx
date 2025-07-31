import { Box, Chip, Menu, MenuItem, Stack } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/lib/utils/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/toast";

interface IProps {
    track: ITrackTop | null;
}

const LikeTrack = (props: IProps) => {
    const { track } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const toast = useToast();
    const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);
    const [playlistMenu, setPlaylistMenu] = useState<null | HTMLElement>(null);
    const open = Boolean(playlistMenu);
    const [playlistsByUser, setPlaylistsByUser] = useState<IPlaylist[] | null>(null);

    useEffect(() => {
        fetchData();
        fetchPlaylistsByUser();
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

    const fetchPlaylistsByUser = async () => {
        const resGetPlaylistsByUserNoJoin = await sendRequest<IBackendRes<IPlaylist[]>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
            method: "POST",
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
            queryParams: {
                page: 1,
                size: 100,
                isJoin: false,
            },
        })

        if (resGetPlaylistsByUserNoJoin?.data) {
            setPlaylistsByUser(resGetPlaylistsByUserNoJoin?.data);
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

    const handleOpenAddPlaylist = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setPlaylistMenu(event.currentTarget);
    };

    const handleClose = () => {
        setPlaylistMenu(null);
    };

    const handleAddTrackToPlaylist = async (playlist: IPlaylist) => {
        const res = await sendRequest<IBackendRes<IPlaylist>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/${playlist._id}/tracks`,
            method: "POST",
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
            body: {
                trackId: track?._id,
            }
        })

        if (res.data) {
            toast.success(`Added to ${playlist?.title}`)
        }

        setPlaylistMenu(null);
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
                    onClick={(event) => handleOpenAddPlaylist(event)}

                    aria-haspopup="menu"
                    aria-expanded={open ? 'true' : undefined}
                    role="menuitem"
                />
                <Menu
                    anchorEl={playlistMenu}
                    open={open}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'center',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}

                    role="menu"
                >
                    {playlistsByUser?.map(item => {
                        return (
                            <MenuItem
                                key={item._id}
                                role="presentation"
                                onClick={() => handleAddTrackToPlaylist(item)}
                            >
                                {item?.title}
                            </MenuItem>
                        )
                    })}
                </Menu>
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