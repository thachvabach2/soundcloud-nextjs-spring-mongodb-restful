'use client'
import { Autocomplete, Box, Button, Grid, InputLabel, LinearProgress, LinearProgressProps, Stack, TextField, Typography } from "@mui/material";
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useDropzone } from "react-dropzone";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <>
            <Box sx={{ flex: 1 }} >
                <LinearProgress
                    variant="determinate"
                    {...props}
                    sx={{
                        height: { xs: '8px', md: '6px' },
                        backgroundColor: 'rgb(221, 221, 221)',
                    }}
                />
            </Box>
            <Box sx={{ display: { xs: 'none', md: 'block', whiteSpace: 'nowrap' } }}>
                <Typography
                    variant="body2"
                    sx={{ color: 'text.primary' }}
                >
                    {`Uploading ${Math.round(props.value)}%`}
                </Typography>
            </Box>
        </>
    );
}

interface IProps {
    trackUpload: {
        fileName: string
        percent: number
    }
    onBack: () => void
}

const Step2 = (props: IProps) => {
    const { trackUpload, onBack } = props;

    const { getRootProps, getInputProps } = useDropzone()

    const top100Films = [
        { label: 'CHILL' },
        { label: 'WORKOUT' },
        { label: 'HIPHOP' },
    ]

    return (
        <>
            <Box component={'div'} sx={{ paddingX: '24px', paddingTop: '16px' }} >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{ alignItems: { md: 'center' }, justifyContent: 'center', marginBottom: { lg: '24px' } }}
                    spacing={2}
                >
                    <Box
                        component={'div'}
                        sx={{
                            maxWidth: { md: '30ch' },
                            color: 'text.primary',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}>
                        <Typography
                            component={'span'}
                            variant="body2"
                        >
                            {trackUpload?.fileName}
                        </Typography>
                    </Box>
                    <LinearProgressWithLabel value={trackUpload?.percent} />

                </Stack>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container justifyContent={'space-between'}>
                        <Grid size={{ xs: 12, lg: 4 }} sx={{ textAlign: 'center', }}>
                            <Button
                                {...getRootProps()}
                                sx={{
                                    '@media (min-width: 480px)': {
                                        height: '400px',
                                        width: '400px',
                                    },
                                    height: '160px',
                                    width: '160px',
                                    backgroundColor: 'unset',
                                    border: '2px dashed rgba(0, 0, 0, 0.15)',
                                    marginY: { xs: '24px', lg: 0 },
                                    cursor: 'pointer',

                                    '&:hover': {
                                        borderColor: 'rgba(0, 0, 0, 0.5)',

                                        '& svg': {
                                            color: 'rgba(0, 0, 0, 0.8)'
                                        }
                                    }
                                }}
                            >
                                <input {...getInputProps()} />
                                <InsertPhotoOutlinedIcon sx={{ fontSize: '120px', color: '#ccc' }} />
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Stack spacing={4}>
                                <Box
                                    component={'div'}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                    }}
                                >
                                    <Box display={'flex'}>
                                        <InputLabel sx={{ fontSize: '14px', fontWeight: 'bold', color: '#121212' }}>
                                            Track title
                                        </InputLabel>
                                        <Box component={'span'} sx={{ color: 'var(--mui-palette-error-main)', marginLeft: '5px' }}>*</Box>
                                    </Box>
                                    <TextField
                                        hiddenLabel
                                        variant="standard"
                                        autoComplete="off"
                                    />
                                </Box>
                                <Box
                                    component={'div'}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                    }}
                                >
                                    <Box display={'flex'}>
                                        <InputLabel sx={{ fontSize: '14px', fontWeight: 'bold', color: '#121212' }}>
                                            Description
                                        </InputLabel>
                                    </Box>
                                    <TextField
                                        hiddenLabel
                                        variant="standard"
                                        autoComplete="off"
                                        placeholder="Track with descriptions"

                                    />
                                </Box>
                                <Box
                                    component={'div'}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                    }}
                                >
                                    <Box display={'flex'}>
                                        <InputLabel sx={{ fontSize: '14px', fontWeight: 'bold', color: '#121212' }}>
                                            Genre
                                        </InputLabel>
                                    </Box>

                                    <Autocomplete
                                        disablePortal
                                        options={top100Films}
                                        renderInput={
                                            (params) => <TextField {...params}
                                                hiddenLabel
                                                variant="standard"
                                                autoComplete="off"
                                                placeholder="Add or search for genre"
                                            />
                                        }
                                    />
                                </Box>
                                <Button variant="contained">
                                    Upload
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Box>
            </Box >
        </>
    )
}

export default Step2;