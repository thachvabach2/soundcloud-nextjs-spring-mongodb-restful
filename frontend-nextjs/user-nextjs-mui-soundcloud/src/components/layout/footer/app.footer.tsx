'use client'
import { CustomAppBar } from '@/components/ui/layout/CustomAppBar';
import { useHasMounted } from '@/hooks/use.has.mounted';
import { useTrackContext } from '@/hooks/use.track.context';
import { convertSlugUrl } from '@/lib/utils/api';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
    const hasMounted = useHasMounted();
    const { currentTrack, setCurrentTrack } = useTrackContext();
    const playerRef = useRef<H5AudioPlayer | null>(null);

    useEffect(() => {
        if (currentTrack?.isPlaying === false) {
            playerRef?.current?.audio?.current?.pause()
        }
        if (currentTrack?.isPlaying === true) {
            playerRef?.current?.audio?.current?.play()
        }
    }, [currentTrack])

    if (!hasMounted) return (<></>);

    return (
        <>
            {currentTrack._id
                &&
                <CustomAppBar
                    position="fixed"
                    sx={{
                        top: 'auto',
                        bottom: 0,
                        backgroundColor: '#f3f3f3',
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid
                            container
                            spacing={3}
                            sx={{
                                maxWidth: 'var(--custom-mui-width-container)',
                                margin: '0 auto',
                                padding: '0 24px',
                                alignItems: 'center',
                            }}
                        >
                            <Grid size={9}
                                sx={{
                                    ".rhap_main": {
                                        gap: '30px'
                                    }
                                }}
                            >
                                <AudioPlayer
                                    ref={playerRef}
                                    className='text-black'
                                    // autoPlay
                                    volume={0.8}
                                    layout='horizontal-reverse'
                                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack?.trackUrl}`}
                                    onPause={e => setCurrentTrack(prev => ({
                                        ...prev,
                                        isPlaying: false,
                                    }))}
                                    onPlay={e => setCurrentTrack(prev => ({
                                        ...prev,
                                        isPlaying: true,
                                    }))}
                                    style={{
                                        boxShadow: 'unset',
                                        backgroundColor: '#f3f3f3',
                                        padding: '10px 0',
                                    }}
                                />
                            </Grid>
                            <Grid size={3}>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: 'center',

                                    alignItems: 'start',
                                }}>
                                    <Box
                                        component={'div'}
                                        sx={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#666',
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            wordBreak: 'normal',
                                            cursor: 'pointer',

                                            '&:hover': {
                                                color: 'hsla(0,0%,40%,0.4)',
                                            }
                                        }}
                                    >
                                        <Link href={`/profile/${currentTrack?.uploader?._id}`}>
                                            <span>
                                                {currentTrack?.uploader?.name ?? currentTrack?.uploader?.email}
                                            </span>
                                        </Link>
                                    </Box>
                                    <Box
                                        component={'div'}
                                        sx={{
                                            fontWeight: 500,
                                            width: '100%',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            wordBreak: 'normal',
                                            cursor: 'pointer',

                                            '&:hover': {
                                                color: 'hsla(0,0%,40%,0.4)',
                                            }
                                        }}
                                    >
                                        <Link href={`/track/${convertSlugUrl(currentTrack.title)}-${currentTrack._id}.html?audio=${currentTrack.trackUrl}`}>
                                            <span>
                                                {currentTrack?.title} - {currentTrack?.artist}
                                            </span>
                                        </Link>
                                    </Box>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>

                </CustomAppBar>
            }
        </>
    )
}

export default AppFooter;