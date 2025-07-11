import { Box, Stack } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface IProps {
    track: ITrackTop | null;
}

const LikeTrack = (props: IProps) => {
    const { track } = props;

    return (
        <>
            <Stack
                className="listenEngagement__actions"
                direction={'row'}
                spacing={3}
            >
                <Box component={'div'}
                    sx={{
                        py: '6px',
                        px: '12px',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',

                        '&:hover svg': {
                            opacity: 0.5
                        }
                    }}
                >
                    <FavoriteIcon sx={{ fontSize: '20px' }} />
                </Box>
                <Box component={'div'}
                    sx={{
                        py: '6px',
                        px: '12px',
                        backgroundColor: '#f3f3f3',
                        cursor: 'pointer',

                        '&:hover svg': {
                            opacity: 0.5
                        }
                    }}
                >
                    <PlaylistAddIcon sx={{ fontSize: '20px' }} />
                </Box>
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