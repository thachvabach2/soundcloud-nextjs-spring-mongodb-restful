'use client'
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useCallback } from "react";
import { FileWithPath, useDropzone } from 'react-dropzone'

interface IProp {
    onFileUploaded: (uploadedFile: any) => void
}

const Step1 = (props: IProp) => {
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {


        acceptedFiles.forEach((file: FileWithPath, index: number) => {
            props.onFileUploaded(file);

            console.log(`files ${index}: `, file);
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = () => {
                // Do whatever you want with the file contents
                const binaryStr = reader.result
                // console.log(binaryStr)
            }
            reader.readAsArrayBuffer(file)
        })

    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

    return (
        <>
            <Box component={'div'} sx={{ paddingX: '24px', paddingTop: '16px' }} >
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
                        borderColor: `${isDragActive ? '#121212' : 'rgba(0, 0, 0, 0.15)'}`
                    }}>
                    <input {...getInputProps()} />
                    <Box component={'span'}>
                        <CloudUploadIcon sx={{ fontSize: '72px' }} />
                    </Box>
                    <Box component={'p'} sx={{ marginY: '24px', fontWeight: 700 }}>
                        Drag and drop audio files to get started.
                    </Box>
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

export default Step1;