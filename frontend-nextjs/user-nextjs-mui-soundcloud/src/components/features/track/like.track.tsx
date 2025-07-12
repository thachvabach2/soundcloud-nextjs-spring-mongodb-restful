import { Box, Chip, Stack } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { likeOrDislikeATrack } from "@/actions/actions.like";

interface IProps {
    track: ITrackTop | null;
    listTrackLikedByAUser: IModelPaginate<ITrackLike> | null;
}

const LikeTrack = (props: IProps) => {
    const { track, listTrackLikedByAUser } = props;
    const trackLikes = listTrackLikedByAUser?.result;

    const handleLikeTrack = async () => {
        if (track && trackLikes) {
            await likeOrDislikeATrack(track?._id, trackLikes);
        }
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