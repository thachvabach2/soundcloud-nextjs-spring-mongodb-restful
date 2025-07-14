'use client'
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTrackContext } from '@/hooks/use.track.context';
import PauseTwoToneIcon from '@mui/icons-material/PauseTwoTone';
import Link from 'next/link';
import { convertSlugUrl } from '@/lib/utils/api';

interface IProps {
    track: ITrackTop
}

const TrackProfile = (props: IProps) => {
    const { track } = props;
    const theme = useTheme();

    const { currentTrack, setCurrentTrack } = useTrackContext();

    return (
        <>
            <Card sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Link href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`} onClick={() => setCurrentTrack({ ...track, isPlaying: false })}>
                            <Typography component="div" variant="h5">
                                {track.title}
                            </Typography>
                        </Link>
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >
                            {track.artist}
                        </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                        <IconButton aria-label="previous">
                            {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                        </IconButton>

                        {currentTrack.isPlaying && currentTrack._id === track._id
                            &&
                            <IconButton aria-label="play/pause"
                                onClick={() => setCurrentTrack({ ...track, isPlaying: false })}
                            >
                                <PauseTwoToneIcon sx={{ height: 38, width: 38 }} />
                            </IconButton>
                        }

                        {(currentTrack._id !== track._id || currentTrack.isPlaying === false && currentTrack._id === track._id)
                            &&
                            <IconButton aria-label="play/pause"
                                onClick={() => setCurrentTrack({ ...track, isPlaying: true })}
                            >
                                <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                            </IconButton>
                        }

                        <IconButton aria-label="next">
                            {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                        </IconButton>
                    </Box>
                </Box>
                <Link href={`/track/${track._id}?audio=${track.trackUrl}&id=${track._id}`} onClick={() => setCurrentTrack({ ...track, isPlaying: false })}>
                    <CardMedia
                        component="img"
                        sx={{ width: 155, height: 155, objectFit: 'fill' }}
                        image={`http://localhost:8080/images/${track.imgUrl}`}
                        alt="Live from space album cover"
                    />
                </Link>
            </Card>

        </>
    )
}

export default TrackProfile;