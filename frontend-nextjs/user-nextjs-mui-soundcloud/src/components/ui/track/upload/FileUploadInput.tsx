import { Box, Button, Fab, Stack, SxProps } from "@mui/material"
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { DropzoneOptions, FileWithPath, useDropzone } from "react-dropzone";
import React, { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { INewTrack } from "@/components/features/track/upload/steps/step2";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Theme } from "@emotion/react";

interface IProps {
    info: INewTrack
    setInfo: Dispatch<SetStateAction<INewTrack>>
}

const FileUploadInput = (props: IProps) => {
    const { info, setInfo } = props;
    const { data: session } = useSession();

    const onDrop = useCallback(async (acceptedFiles: FileWithPath[]) => {
        if (acceptedFiles && acceptedFiles[0]) {

            const image = acceptedFiles[0];
            const formData = new FormData();
            formData.append('fileUpload', image);
            try {
                const res = await axios.post('http://localhost:8080/api/v1/files/upload', formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`,
                            'target_type': 'images',
                        },
                    }
                )
                setInfo(prev => ({
                    ...prev,
                    imgUrl: res.data?.data?.fileName,
                }))
            } catch (error) {
                //@ts-ignore
                alert(error?.response?.data?.message)
            }
        }
    }, [session])

    const dropzoneConfig: DropzoneOptions = useMemo(() => ({
        onDrop,
        multiple: false,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        },

    }), []);

    const { getRootProps, getInputProps } = useDropzone(dropzoneConfig)

    const uploadImgStyles: SxProps<Theme> = useMemo(() => ({
        '@media (min-width: 480px)': {
            height: '400px',
            width: '400px',
        },
        height: '160px',
        width: '160px',
        backgroundColor: 'unset',
        border: '2px dashed rgba(0, 0, 0, 0.15)',
        borderRadius: '4px',
        marginY: { xs: '24px', lg: 0 },
        marginX: 'auto',
        cursor: 'pointer',

        '&:hover': {
            borderColor: 'rgba(0, 0, 0, 0.5)',

            '& svg': {
                color: 'rgba(0, 0, 0, 0.8)'
            }
        }
    }), [])

    return (
        <>
            {info.imgUrl
                ?
                <>
                    <Box style={{ position: 'relative' }} sx={{
                        ...uploadImgStyles,
                        border: 'none',
                        cursor: 'default',
                    }}>
                        <Box component={'img'}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
                            sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <Stack spacing={2}
                            sx={{
                                position: 'absolute',
                                bottom: '16px',
                                right: '16px',
                            }}
                        >
                            <Fab size="small" aria-label="add"
                                {...getRootProps()}
                            >
                                <input {...getInputProps()} />
                                <EditOutlinedIcon />
                            </Fab>
                            <Fab size="small" aria-label="add"
                                onClick={() => {
                                    setInfo(prev => ({
                                        ...prev,
                                        imgUrl: '',
                                    }))
                                }}
                            >
                                <DeleteForeverOutlinedIcon />
                            </Fab>
                        </Stack>
                    </Box>
                </>
                :
                <Button
                    {...getRootProps()}
                    sx={uploadImgStyles}
                >
                    <input {...getInputProps()} />
                    <InsertPhotoOutlinedIcon sx={{ fontSize: '120px', color: '#ccc' }} />
                </Button>
            }

        </>
    )
}

export default React.memo(FileUploadInput);