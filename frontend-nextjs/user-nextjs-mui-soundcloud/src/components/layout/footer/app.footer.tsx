'use client'
import { CustomAppBar } from '@/components/ui/layout/CustomAppBar';
import { useHasMounted } from '@/hooks/use.has.mounted';
import { useTrackContext } from '@/hooks/use.track.context';
import { Box, Grid } from '@mui/material';
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
                                <div style={{ fontSize: '12px', color: '#666' }}>{currentTrack?.artist}</div>
                                <div style={{ fontWeight: 500 }}>{currentTrack?.title}</div>
                            </div>
                        </Grid>
                    </Grid>
                </Box>

            </CustomAppBar>
        </>
    )
}

export default AppFooter;