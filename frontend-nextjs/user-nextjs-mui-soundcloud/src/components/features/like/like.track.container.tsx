'use client'

import { Box, ClickAwayListener, Divider, Grid, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popover, Stack } from "@mui/material";
import Link from "next/link";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { convertSlugUrl } from "@/lib/utils/api";
import Image from "next/image";
import { useTrackContext } from "@/hooks/use.track.context";
import PauseIcon from '@mui/icons-material/Pause';
import { MouseEvent, useEffect, useState } from "react";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { useToast } from "@/hooks/toast";
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SpatialAudioOffOutlinedIcon from '@mui/icons-material/SpatialAudioOffOutlined';
import { likeOrDislikeATrack } from "@/actions/actions.like";
import { signOut, useSession } from "next-auth/react";

interface IProps {
    tracksLiked: ITrackLike[]
}

interface IContextMenu {
    mouseX: number;
    mouseY: number;
    trackId: string;
}

const LikeTrackContainer = (props: IProps) => {
    const { tracksLiked } = props;
    const { currentTrack, setCurrentTrack } = useTrackContext();
    const toast = useToast();
    const { data: session } = useSession();
    const [contextMenu, setContextMenu] = useState<IContextMenu | null>(null);

    const openContextMenu = Boolean(contextMenu);

    useEffect(() => {
        if (session?.error !== "RefreshTokenError") return
        signOut() // Force sign in to obtain a new set of access and refresh tokens
    }, [session?.error])

    const handlePause = (track: ITrackLike) => {
        setCurrentTrack({
            ...track,
            isPlaying: false,
        })
    }

    const handlePlay = (track: ITrackLike) => {
        setCurrentTrack({
            ...track,
            isPlaying: true,
        })
    }

    const handleClick = (event: MouseEvent<HTMLAnchorElement>, track: ITrackLike) => {
        event.preventDefault();

        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            trackId: track._id,
        })

    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handleDeleteLikedTrack = async () => {
        if (!contextMenu?.trackId) return;

        const res = await likeOrDislikeATrack(contextMenu?.trackId, -1);

        if (res.data) {
            toast.success('Removed from Liked Songs')
        } else {
            toast.error(res?.message);
        }
        setContextMenu(null);
    }

    return (
        <>
            <div className="collectionSection">
                <div className="collectionSection-top px-[24px] py-[8px]">
                    <span className="text-xl font-medium">
                        Hear the tracks you’ve liked:
                    </span>
                </div>
                <div className="collectionSection__list px-[12px] mt-[20px]">
                    <Grid component={'ul'} container>
                        {tracksLiked?.map(item => {
                            return (
                                <Grid component={'li'} size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={item._id}>
                                    <Link
                                        href={`/track/${convertSlugUrl(item.title)}-${item._id}.html?audio=${item.trackUrl}`}
                                        onContextMenu={(e) => handleClick(e, item)}
                                    >
                                        <Stack
                                            className="p-[12px] cursor-pointer relative z-0"
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: '#dddddd',
                                                    borderRadius: '6px',

                                                    '.player': {
                                                        opacity: 1,
                                                        bottom: '8px'
                                                    }
                                                }
                                            }}
                                            spacing={1}
                                        >
                                            <div className="top-side">
                                                <div>
                                                    <div className="relative w-full bg-[#333] rounded-[6px] pb-[100%]">
                                                        <div className="absolute h-full w-full flex justify-center items-center">
                                                            <Image
                                                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
                                                                alt="track image"
                                                                fill
                                                                sizes="100vw"
                                                                style={{
                                                                    objectFit: 'cover', // cover, contain, none
                                                                    borderRadius: '4px',
                                                                    objectPosition: 'center center',
                                                                }}
                                                            />
                                                        </div>
                                                        <Box
                                                            className={
                                                                `player absolute rounded-[50%] pointer-events-auto right-[8px] transition-all duration-300 ease-in-out
                                                                ${currentTrack._id === item._id && currentTrack.isPlaying
                                                                    ? 'opacity-100 bottom-[8px]'
                                                                    : 'opacity-0 bottom-0'
                                                                }`
                                                            }
                                                            component={'div'}
                                                        >
                                                            <div className="border-0 rounded-[9999px] cursor-pointer relative inline-block text-center"
                                                            >
                                                                {currentTrack._id === item._id && currentTrack.isPlaying
                                                                    &&
                                                                    <button
                                                                        className={`${currentTrack._id === item._id ? 'bg-[#3be477]' : 'bg-[#1ed760]'} rounded-[9999px] relative flex items-center justify-center text-center cursor-pointer hover:scale-[1.04] hover:bg-[#3be477]`}
                                                                        style={{ blockSize: '48px', inlineSize: '48px' }}
                                                                        onClick={(e) => { e.preventDefault(); handlePause(item) }}
                                                                        data-prevent-progress={true}
                                                                    >
                                                                        <PauseIcon sx={{ fontSize: 28 }} />
                                                                    </button>
                                                                }
                                                                {(currentTrack._id !== item._id || currentTrack.isPlaying === false && currentTrack._id === item._id)
                                                                    &&
                                                                    <button
                                                                        className={`${currentTrack._id === item._id ? 'bg-[#3be477]' : 'bg-[#1ed760]'} rounded-[9999px] relative flex items-center justify-center text-center cursor-pointer hover:scale-[1.04] hover:bg-[#3be477]`}
                                                                        style={{ blockSize: '48px', inlineSize: '48px' }}
                                                                        onClick={(e) => { e.preventDefault(); handlePlay(item) }}
                                                                        data-prevent-progress={true}
                                                                    >
                                                                        <PlayArrowIcon sx={{ fontSize: 28 }} />
                                                                    </button>
                                                                }
                                                            </div>
                                                        </Box>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bottom-side" style={{ display: 'flex', alignItems: 'center' }}>
                                                <Stack>
                                                    <div className="flex">
                                                        <span className="text-[0.875rem] font-medium hover:text-[hsla(0,0%,40%,0.4)] line-clamp-1 break-all text-ellipsis whitespace-normal"
                                                            style={{
                                                                color: `${currentTrack._id === item._id ? '#1ed760' : ''} `,
                                                            }}
                                                        >
                                                            {item?.title} - {item?.artist}
                                                        </span>
                                                    </div>
                                                </Stack>
                                            </div>
                                        </Stack>
                                    </Link>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div >
            </div >

            <Popover
                id={'context-menu'}
                open={openContextMenu}
                anchorReference="anchorPosition"
                onClose={handleClose}
                anchorPosition={
                    contextMenu ? {
                        top: contextMenu.mouseY,
                        left: contextMenu.mouseX
                    } : undefined
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                sx={{ pointerEvents: 'none' }}
                slotProps={{
                    paper: {
                        sx: { pointerEvents: 'auto' }
                    }
                }}
            >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList
                            sx={{
                                '& .MuiDivider-root': {
                                    my: '0px'
                                },
                                '& .MuiMenuItem-root': {
                                    py: '8px'
                                }
                            }}
                        >
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <AddIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Add to playlist</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <MenuItem onClick={() => handleDeleteLikedTrack()}>
                                <ListItemIcon>
                                    <CheckCircleIcon fontSize="small" sx={{ color: '#1ed760' }} />
                                </ListItemIcon>
                                <ListItemText>Remove from your Liked Songs</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <PlaylistAddIcon fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText>Add to queue</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <Divider />
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <SpatialAudioOffOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Go to artist</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <ContentCopyOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Copy link to playlist</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popover >
        </>
    )
}

export default LikeTrackContainer;