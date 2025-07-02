import { Button } from "@mui/material"
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import { useDropzone } from "react-dropzone";
import { useMemo } from "react";

export const FileUploadInput = () => {
    const dropzoneConfig = useMemo(() => ({
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        }
    }), []);

    const { getRootProps, getInputProps } = useDropzone(dropzoneConfig)

    return (
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
    )
}