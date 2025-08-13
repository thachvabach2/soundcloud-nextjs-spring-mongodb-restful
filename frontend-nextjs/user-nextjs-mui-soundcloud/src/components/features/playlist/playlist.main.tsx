'use client'

import { Box, Button, ClickAwayListener, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popover, Stack } from "@mui/material";
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from "next/link";
import { MouseEvent, useState } from "react";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import HeadphonesOutlinedIcon from '@mui/icons-material/HeadphonesOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { deletePlaylistByIdAction } from "@/actions/actions.playlist";
import { useToast } from "@/hooks/toast";
import theme from "@/theme";

interface IProps {
    playlists: IPlaylist[];
}

interface IContextMenu {
    mouseX: number;
    mouseY: number;
    playlistId: string;
    playlistName: string
}

const PlaylistMain = (props: IProps) => {
    const { playlists } = props;
    const toast = useToast();
    const [contextMenu, setContextMenu] = useState<IContextMenu | null>(null);
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const openContextMenu = Boolean(contextMenu && !openDialogDelete);

    const handleClick = (event: MouseEvent<HTMLAnchorElement>, playlist: IPlaylist) => {
        event.preventDefault();

        setContextMenu({
            mouseX: event.clientX,
            mouseY: event.clientY,
            playlistId: playlist._id,
            playlistName: playlist.title,
        })

    };

    const handleClose = () => {
        setOpenDialogDelete(false);
        setContextMenu(null);
    };

    const handleDeletePlaylist = async () => {
        if (!contextMenu?.playlistId) return;

        const res = await deletePlaylistByIdAction(contextMenu.playlistId);

        if (res.data) {
            toast.success('Removed from Your Playlist')
        } else {
            toast.error(res?.message);
        }
        setOpenDialogDelete(false);
        setContextMenu(null)
    }

    const handleCloseDialogDelete = () => {
        setOpenDialogDelete(false);
        setContextMenu(null);
    };

    return (
        <>
            <div className="main-content px-[14px]" onContextMenu={(e) => e.preventDefault()}>
                <Grid component={'ul'} container>
                    {playlists?.map(playlist => {
                        return (
                            <Grid component={'li'} size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={playlist._id}>
                                <Link
                                    href={`/playlist/${playlist._id}`}
                                    onContextMenu={(e) => handleClick(e, playlist)}
                                >
                                    <Stack
                                        className="p-[12px] cursor-pointer relative z-0"
                                        sx={[
                                            {
                                                '&:hover': {
                                                    backgroundColor: '#dddddd',
                                                    borderRadius: '6px',

                                                    '.player': {
                                                        transform: 'translateY(-8px)',
                                                        opacity: 1,
                                                        transition: 'all .3s ease',
                                                    }
                                                }
                                            },
                                            theme.applyStyles('dark', {
                                                '&:hover': {
                                                    backgroundColor: '#1f1f1f',
                                                }
                                            })
                                        ]}
                                        spacing={1}
                                    >
                                        <div className="top-side">
                                            <div>
                                                <div className="relative w-full bg-[#333] rounded-[6px] pb-[100%]">
                                                    <div className="absolute h-full w-full flex justify-center items-center">
                                                        <HeadphonesIcon sx={{ fontSize: 70, color: '#b3b3b3' }} />
                                                    </div>
                                                    <Box
                                                        className="player absolute rounded-[50%] opacity-0 pointer-events-auto bottom-0 right-[8px]"
                                                        component={'div'}
                                                    >
                                                        <div className="border-0 rounded-[9999px] cursor-pointer relative inline-block text-center">
                                                            <button
                                                                className="bg-[#1ed760] rounded-[9999px] relative flex items-center justify-center text-center cursor-pointer hover:scale-[1.04] hover:bg-[#3be477]"
                                                                style={{ blockSize: '48px', inlineSize: '48px' }}
                                                            >
                                                                <PlayArrowIcon sx={{ fontSize: 28 }} />
                                                            </button>
                                                        </div>
                                                    </Box>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bottom-side" style={{ display: 'flex', alignItems: 'center' }}>
                                            <Stack>
                                                <div style={{ display: 'flex' }}>
                                                    <span className="text-[1rem] dark:text-[#fff] font-medium hover:text-[hsla(0,0%,40%,0.4)] line-clamp-1 break-all text-ellipsis whitespace-normal">
                                                        {playlist?.title}
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                    <span className="text-[0.875rem] font-medium text-[#666] dark:text-[#b3b3b3] hover:text-[hsla(0,0%,40%,0.4)] line-clamp-1 break-all text-ellipsis whitespace-normal">
                                                        {playlist?.user?.name}
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
                                    <PlaylistAddIcon fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText>Add to queue</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <Divider />
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <EditOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Edit details</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <MenuItem onClick={() => setOpenDialogDelete(true)}>
                                <ListItemIcon>
                                    <RemoveCircleOutlineIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <Divider />
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <HeadphonesOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Create playlist</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <Divider />
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <LockOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Make private</ListItemText>
                                <div className="ms-[16px]"></div>
                            </MenuItem>
                            <MenuItem disabled>
                                <ListItemIcon>
                                    <PushPinOutlinedIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Pin playlist</ListItemText>
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

            <Dialog
                open={openDialogDelete}
                onClose={handleClose}
                slotProps={{
                    transition: {
                        timeout: {
                            enter: 400,
                            exit: 0,
                        }
                    },
                }}
            >
                <DialogTitle>
                    Delete from Your Playlist
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span className="text-[#000] font-light">
                            This will delete
                            <b>
                                {` ${contextMenu?.playlistName} `}
                            </b>
                            from&nbsp;
                            <b>
                                Your Playlist.
                            </b>
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pr: '20px', pb: '20px' }}>
                    <Button onClick={handleCloseDialogDelete} sx={{ textTransform: 'none', mr: '10px' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleDeletePlaylist} autoFocus sx={{ textTransform: 'none' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PlaylistMain;