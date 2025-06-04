'use client'
import { useHasMounted } from '@/utils/customHook';
import { AppBar, Box, Grid } from '@mui/material';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const AppFooter = () => {
    const hasMounted = useHasMounted();

    if (!hasMounted) return (<></>);

    return (
        <AppBar
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
                    <Grid size={9} >
                        <AudioPlayer
                            className='text-black'
                            // autoPlay
                            volume={0.8}
                            layout='horizontal-reverse'
                            src="https://samplelib.com/lib/preview/mp3/sample-3s.mp3"
                            onPlay={e => console.log("onPlay")}
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
                            <div style={{ color: '#ccc' }}>Ryder</div>
                            <div>Hello World</div>
                        </div>
                    </Grid>
                </Grid>
            </Box>

        </AppBar>
    )
}

export default AppFooter;