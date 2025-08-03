'use client'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack } from "@mui/material";
import PlaylistTable from "./playlist.table";
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/toast';
import { deletePlaylistByIdAction } from '@/actions/actions.playlist';
import { useState } from 'react';

interface IProps {
    playlist: IPlaylist;
}

const PlaylistDetailListTrack = (props: IProps) => {
    const { playlist } = props;
    const params = useParams();
    const { slug: playlistId } = params;

    const toast = useToast();
    const router = useRouter();
    const [openDialogDelete, setOpenDialogDelete] = useState(false);

    const handleDeletePlaylist = async () => {
        if (!playlistId) return;

        const res = await deletePlaylistByIdAction(playlistId as string);

        if (res.data) {
            toast.success('Removed from Your Playlist');
            router.push('/');
            setOpenDialogDelete(false);
        } else {
            toast.error(res?.message);
        }
    }

    return (
        <>
            <div className="playlist-actions px-[24px] py-[24px]">
                <Stack
                    className="listenEngagement__actions"
                    direction={'row'}
                    spacing={1}
                >
                    <Chip
                        // onClick={handleLikeTrack}
                        label={"Shuffle"}
                        size="medium"
                        variant="outlined"
                        // color={trackLikes?.some(t => t._id === track?._id) ? 'error' : 'default'}
                        icon={<ShuffleIcon />}
                        sx={{ borderRadius: '5px' }}
                    />
                    <Chip
                        label={"Save to Your Playlist"}
                        size="medium"
                        variant="outlined"
                        color="default"
                        icon={<AddCircleOutlineOutlinedIcon />}
                        sx={{ borderRadius: '5px' }}
                    />
                    <Chip
                        label={"Download"}
                        size="medium"
                        variant="outlined"
                        color="default"
                        icon={<DownloadForOfflineOutlinedIcon />}
                        sx={{ borderRadius: '5px' }}
                    />
                    <Chip
                        label={"Add to queue"}
                        size="medium"
                        variant="outlined"
                        color="default"
                        icon={<PlaylistAddOutlinedIcon />}
                        sx={{ borderRadius: '5px' }}
                    />
                    <Chip
                        label={"Edit"}
                        size="medium"
                        variant="outlined"
                        color="default"
                        icon={<EditOutlinedIcon />}
                        sx={{ borderRadius: '5px' }}
                    />
                    <Chip
                        label={"Delete Playlist"}
                        size="medium"
                        variant="outlined"
                        color="default"
                        icon={<DeleteOutlineOutlinedIcon />}
                        sx={{ borderRadius: '5px' }}
                        onClick={() => setOpenDialogDelete(true)}
                    />
                </Stack>
            </div>
            <PlaylistTable
                playlist={playlist}
            />

            <Dialog
                open={openDialogDelete}
                onClose={() => setOpenDialogDelete(false)}
            >
                <DialogTitle>
                    Delete from Your Playlist
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <span className="text-[#000] font-light">
                            This will delete
                            <b>
                                {` ${playlist?.title} `}
                            </b>
                            from&nbsp;
                            <b>
                                Your Playlist.
                            </b>
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pr: '20px', pb: '20px' }}>
                    <Button onClick={() => setOpenDialogDelete(false)} sx={{ textTransform: 'none', mr: '10px' }}>Cancel</Button>
                    <Button variant="contained" onClick={handleDeletePlaylist} autoFocus sx={{ textTransform: 'none' }}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default PlaylistDetailListTrack;