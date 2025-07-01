'use client'
import { Box, Button, Grid, InputLabel, LinearProgress, LinearProgressProps, Stack, Typography } from "@mui/material";
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useDropzone } from "react-dropzone";
import React, { useEffect, useMemo, useState } from "react";
import { AutocompleteElement, TextFieldElement, useForm } from 'react-hook-form-mui'

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
    artist: string,
    description: string,
    trackUrl: string,
    imgUrl: string,
    category: string
}

interface ITrackForm {
    title: string,
    artist: string,
    description: string,
    category: string
}

const Step2 = (props: IProps) => {
    const { trackUpload } = props;

    const [info, setInfo] = useState<INewTrack>({
        title: '',
        artist: '',
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

    const listGenre = useMemo(() => ['CHILL', 'WORKOUT', 'HIPHOP',], [])

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

    //
    const { control, handleSubmit } = useForm({
        defaultValues: {
            title: '',
            artist: '',
            description: '',
            category: ''
        },
    })

    const handleUploadTrackAfterUpload = (data: ITrackForm) => {
        setInfo(prev => ({
            ...prev,
            ...data
        }));
    }

    console.log('>>> check info: ', info)
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

                <form onSubmit={handleSubmit(handleUploadTrackAfterUpload)} noValidate>
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
                                        <TextFieldElement
                                            name={'title'}
                                            control={control}
                                            rules={{
                                                required: 'Please enter a title',
                                            }}
                                            {...textFieldProps}
                                        />
                                    </Box>
                                    <Box
                                        component={'div'}
                                        sx={fieldContainerStyles}
                                    >
                                        <Box display={'flex'}>
                                            <InputLabel sx={labelStyles}>
                                                Main Artist(s)
                                            </InputLabel>
                                            <Box component={'span'} sx={{ color: 'var(--mui-palette-error-main)', marginLeft: '5px' }}>*</Box>
                                        </Box>
                                        <TextFieldElement
                                            name={'artist'}
                                            control={control}
                                            rules={{
                                                required: 'Please enter a valid artist name.',
                                            }}
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
                                        <TextFieldElement
                                            name={'description'}
                                            control={control}
                                            placeholder="Track with descriptions"
                                            {...textFieldProps}
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

                                        <AutocompleteElement
                                            name={'category'}
                                            options={listGenre}
                                            control={control}
                                            textFieldProps={{
                                                ...textFieldProps,
                                                placeholder: "Add or search for genre"
                                            }}
                                        />
                                    </Box>
                                    <Button variant="contained" type={'submit'}>
                                        Upload
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Box >
        </>
    )
}

export default React.memo(Step2);