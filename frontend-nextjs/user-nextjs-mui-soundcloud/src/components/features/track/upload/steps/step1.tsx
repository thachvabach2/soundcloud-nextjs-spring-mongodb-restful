'use client'
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";
import { FileWithPath, useDropzone } from 'react-dropzone'
import { useSession } from "next-auth/react";
import axios, { AxiosProgressEvent } from 'axios';

interface ITrackUpload {
    fileName: string
    percent: number
    uploadedTrackName: string
}
interface IProp {
    setIsUploaded: (value: boolean) => void
    // chuẩn React, == setTrackUpload: (value: ITrackUpload | ((prev: ITrackUpload) => ITrackUpload)) => void
    setTrackUpload: Dispatch<SetStateAction<ITrackUpload>>
    trackUpload: ITrackUpload
}

const Step1 = (props: IProp) => {
    const { setIsUploaded, setTrackUpload, trackUpload } = props;
    const [isAcceptedFile, setIsAcceptedFile] = useState<boolean>(true);

    const { data: session } = useSession();
    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        if (acceptedFiles.length === 0) {
            setIsAcceptedFile(false);
            return;
        }

        if (acceptedFiles && acceptedFiles[0]) {
            const audio = acceptedFiles[0];

            setIsUploaded(true);
            setIsAcceptedFile(true);

            const formData = new FormData();
            formData.append('fileUpload', audio);
            try {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL_FOR_CLIENT}/api/v1/files/upload`, formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`,
                            'target_type': 'tracks',
                        },
                        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                            const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total!)
                            setTrackUpload((prev: ITrackUpload) => ({
                                ...prev,
                                fileName: acceptedFiles[0].name,
                                percent: percentCompleted
                            }))
                        },
                    }
                )
                setTrackUpload(prevTrackUpload => ({
                    ...prevTrackUpload,
                    uploadedTrackName: res?.data?.data?.fileName
                }))
            } catch (error) {
                //@ts-expect-error: error
                alert(error?.response?.data?.message ?? 'Backend error')
            }
        }
    }, [session, setIsUploaded, setTrackUpload])

    const dropzoneConfig = useMemo(() => ({
        onDrop,
        multiple: false,
        accept: {
            'audio': ['.mp3', '.m4a', '.wav'],
        },
    }), [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneConfig);

    return (
        <>
            <Box component={'div'}>
                <Typography
                    variant="h4"
                    component={'h1'}
                    sx={{ fontWeight: 700, letterSpacing: '-1px', marginY: '24px', lineHeight: '32px' }}
                >
                    Upload your audio files.
                </Typography>
                <Box component={'p'}>
                    For best quality, use WAV, FLAC, AIFF, or ALAC. The maximum file size is 4GB uncompressed. Learn more.
                </Box>
                <Box
                    component={'div'}
                    {...getRootProps()}
                    sx={{
                        textAlign: 'center',
                        padding: '32px',
                        border: '2px dashed',
                        borderRadius: '4px',
                        margin: '32px 0',
                        minHeight: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'border-color .3s ease-in-out',

                        '&:hover': {
                            borderColor: '#121212'
                        },
                        borderColor: `${isDragActive ? '#121212' : isAcceptedFile ? 'rgba(0, 0, 0, 0.15)' : '#E61948'}`
                    }}>
                    <input {...getInputProps()} />
                    <Box component={'span'}>
                        <CloudUploadIcon sx={{ fontSize: '72px' }} />
                    </Box>
                    {isAcceptedFile
                        ?
                        <Box component={'p'} sx={{ marginY: '24px', fontWeight: 700 }}>
                            Drag and drop audio files to get started.
                        </Box>
                        :
                        <Box component={'p'} sx={{ marginY: '24px', fontWeight: 700, color: '#E61948' }}>
                            File type is not supported.
                        </Box>
                    }

                    <Button
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            borderRadius: '100px',
                            backgroundColor: '#121212',
                            color: '#fff',

                            '&:hover': {
                                backgroundColor: '#454545'
                            },

                            '&:link': {
                                backgroundColor: '#454545'
                            },
                            paddingY: '8px',
                        }}
                    >
                        Choose files
                    </Button>
                </Box>
            </Box>
        </>
    )
}

export default React.memo(Step1);