'use client'
import { Box, Button, Grid, InputLabel, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { AutocompleteElement, TextFieldElement, useForm } from 'react-hook-form-mui'
import FileUploadInput from "@/components/ui/track/upload/FileUploadInput";
import { LinearProgressWithLabel } from "@/components/ui/track/upload/LinearProgressWithLabel";
import { sendRequest } from "@/lib/utils/api";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/toast";

interface IProps {
    trackUpload: {
        fileName: string
        percent: number
        uploadedTrackName: string
    }
    onBack: () => void
}

export interface INewTrack {
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
    const { trackUpload, onBack } = props;
    const { data: session } = useSession();
    const toast = useToast();

    const [info, setInfo] = useState<INewTrack>({
        title: '',
        artist: '',
        description: '',
        trackUrl: '',
        imgUrl: '',
        category: ''
    });

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

    const handleSubmitForm = async (data: ITrackForm) => {
        setInfo(prev => ({
            ...prev,
            ...data
        }));
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: "http://localhost:8080/api/v1/tracks",
            method: "POST",
            body: {
                title: data.title,
                artist: data.artist,
                description: data.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: data.category
            },
            headers: {
                'Authorization': `Bearer ${session?.access_token}`,
            },
        })
        if (res.data) {
            onBack();
            setInfo({
                title: '',
                artist: '',
                description: '',
                trackUrl: '',
                imgUrl: '',
                category: ''
            })
            toast.success("Create a new track success!")
        } else {
            toast.error(res.message)
        }
    }

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

                <form onSubmit={handleSubmit(handleSubmitForm)} noValidate>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container justifyContent={'space-between'}>
                            <Grid size={{ xs: 12, lg: 4 }} sx={{ textAlign: 'center', }}>
                                <FileUploadInput info={info} setInfo={setInfo} />
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