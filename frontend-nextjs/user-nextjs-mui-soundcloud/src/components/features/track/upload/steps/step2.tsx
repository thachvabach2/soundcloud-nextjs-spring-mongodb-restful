'use client'
import { Autocomplete, Box, Button, Grid, InputLabel, LinearProgress, LinearProgressProps, Stack, TextField, Typography } from "@mui/material";
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useDropzone } from "react-dropzone";
import React, { useCallback, useEffect, useMemo, useState } from "react";

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
        uploadedTrackName: string
    }
}

interface INewTrack {
    title: string,
    description: string,
    trackUrl: string,
    imgUrl: string,
    category: string
}

const Step2 = (props: IProps) => {
    const { trackUpload } = props;

    const [info, setInfo] = useState<INewTrack>({
        title: '',
        description: '',
        trackUrl: '',
        imgUrl: '',
        category: ''
    });

    const dropzoneConfig = useMemo(() => ({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        }
    }), []);
    const { getRootProps, getInputProps } = useDropzone(dropzoneConfig)

    useEffect(() => {
        if (trackUpload?.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            })
            // console.log('render useEffect step2');
        }
    }, [trackUpload])

    const top100Films = useMemo(() => [
        { label: 'CHILL' },
        { label: 'WORKOUT' },
        { label: 'HIPHOP' },
    ], [])

    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInfo(prevInfo => ({
            ...prevInfo,
            title: e.target.value,
        }));
    }, []);

    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInfo(prevInfo => ({
            ...prevInfo,
            description: e.target.value,
        }));
    }, []);

    const handleCategoryChange = useCallback((event: any, newInputValue: string) => {
        setInfo(prevInfo => ({
            ...prevInfo,
            category: newInputValue,
        }));
    }, []);

    const uploadButtonStyles = useMemo(() => ({
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
    }), [])

    const fieldContainerStyles = useMemo(() => ({
        display: 'flex',
        flexDirection: 'column' as const,
        width: '100%',
    }), []);

    const labelStyles = useMemo(() => ({
        fontSize: '14px',
        fontWeight: 'bold',
        color: '#121212'
    }), []);

    const textFieldProps = useMemo(() => ({
        hiddenLabel: true,
        variant: 'standard' as const,
        autoComplete: 'off',
    }), []);

    // console.log('>>> render info: ', info)
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
                                sx={uploadButtonStyles}
                            >
                                <input {...getInputProps()} />
                                <InsertPhotoOutlinedIcon sx={{ fontSize: '120px', color: '#ccc' }} />
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, lg: 6 }}>
                            <Stack spacing={4}>
                                <Box
                                    component={'div'}
                                    sx={fieldContainerStyles}
                                >
                                    <Box display={'flex'}>
                                        <InputLabel sx={labelStyles}>
                                            Track title
                                        </InputLabel>
                                        <Box component={'span'} sx={{ color: 'var(--mui-palette-error-main)', marginLeft: '5px' }}>*</Box>
                                    </Box>
                                    <TextField
                                        value={info?.title}
                                        // value={trackUpload?.uploadedTrackName}
                                        onChange={handleTitleChange}
                                        {...textFieldProps}
                                    />
                                </Box>
                                <Box
                                    component={'div'}
                                    sx={fieldContainerStyles}
                                >
                                    <Box display={'flex'}>
                                        <InputLabel sx={labelStyles}>
                                            Description
                                        </InputLabel>
                                    </Box>
                                    <TextField
                                        value={info?.description}
                                        onChange={handleDescriptionChange}
                                        {...textFieldProps}
                                        placeholder="Track with descriptions"

                                    />
                                </Box>
                                <Box
                                    component={'div'}
                                    sx={fieldContainerStyles}
                                >
                                    <Box display={'flex'}>
                                        <InputLabel sx={labelStyles}>
                                            Genre
                                        </InputLabel>
                                    </Box>

                                    <Autocomplete
                                        inputValue={info?.category}
                                        onInputChange={handleCategoryChange}
                                        disablePortal
                                        options={top100Films}
                                        renderInput={
                                            (params) => <TextField
                                                {...params}
                                                {...textFieldProps}
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

export default React.memo(Step2);