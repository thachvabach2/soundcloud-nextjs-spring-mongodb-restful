'use client'

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Chip, Stack } from "@mui/material";
import PlaylistTable from "./playlist.table";

interface IProps {
    playlist: IPlaylist;
}

const PlaylistDetailListTrack = (props: IProps) => {
    const { playlist } = props;

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
                    />
                </Stack>
            </div>
            <PlaylistTable
                playlist={playlist}
            />
        </>
    )
}

export default PlaylistDetailListTrack;