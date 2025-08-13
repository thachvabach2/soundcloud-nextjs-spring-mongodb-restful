'use client'
import { Button, Dialog, DialogContent, DialogTitle, FormControlLabel, IconButton, Stack, styled, Switch, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { createEmptyPlaylistAction } from "@/actions/actions.playlist";
import { useToast } from "@/hooks/toast";
import theme from "@/theme";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: '0px 24px',
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
        minHeight: '284px',
        width: '524px',
    },
}));

interface INewPlayList {
    title: string;
    isPubic: boolean;
}

interface IProps {
    openDialog: boolean;
    setOpenDialog: Dispatch<SetStateAction<boolean>>;
}

const DialogCreatePlaylist = (props: IProps) => {
    const { openDialog, setOpenDialog } = props;
    const toast = useToast();
    const [newPlaylist, setNewPlaylist] = useState<INewPlayList>({
        title: '',
        isPubic: true,
    });

    const handleClose = () => {
        setOpenDialog(false);
        setNewPlaylist({
            title: '',
            isPubic: true,
        })
    };

    const handleCloseBackdrop = (event: any, reason: "backdropClick" | "escapeKeyDown") => {
        if (reason && reason === 'backdropClick') {
            return;
        }
        handleClose();
    }

    const handleCreateEmptyPlaylist = async () => {
        const { title, isPubic } = newPlaylist;
        const res = await createEmptyPlaylistAction(title, isPubic);

        if (res.data) {
            toast.success("Create playlist succeed!");
            setOpenDialog(false);
            setNewPlaylist({
                title: '',
                isPubic: true,
            });
        } else {
            toast.error(res.message);
        }
    }

    return (
        <BootstrapDialog
            onClose={handleCloseBackdrop}
            open={openDialog}
        >
            <DialogTitle sx={{ m: 0, p: '24px 16px 18px 24px' }}>
                <div className="flex flex-row items-center justify-between">
                    <span className="font-extrabold">
                        Create new playlist
                    </span>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={(theme) => ({
                            color: theme.palette.grey[500],
                            padding: '6px'
                        })}
                    >
                        <CloseIcon
                            sx={[
                                {
                                    fontSize: '20px',
                                    color: '#121212',
                                },
                                theme.applyStyles('dark', {
                                    color: 'hsla(0,0%,100%,.7)'
                                })
                            ]}
                        />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent>
                <Stack direction={'row'} spacing={2} sx={{ paddingTop: '6px' }}>
                    <div className="relative min-h-[180px] min-w-[180px] bg-[#333]">
                        <div className="absolute h-full w-full flex justify-center items-center">
                            <HeadphonesIcon sx={{ fontSize: 70, color: '#b3b3b3' }} />
                        </div>
                    </div>
                    <Stack className="w-full" justifyContent={'space-between'}>
                        <div className="flex flex-col gap-3">
                            <TextField
                                required
                                variant="outlined"
                                label="Name"
                                placeholder="Add a name"
                                fullWidth
                                size="small"
                                slotProps={{
                                    inputLabel: {
                                        // shrink: true,
                                        sx: [{
                                            '&.Mui-focused': {
                                                color: '#121212'
                                            },
                                        },
                                        theme.applyStyles('dark', {
                                            '&.Mui-focused': {
                                                color: '#b3b3b3'
                                            },
                                        })
                                        ]
                                    },
                                    htmlInput: {
                                        autoComplete: 'off',
                                    }
                                }}
                                sx={[
                                    {
                                        bgcolor: '#f3f3f3',
                                        borderRadius: '4px',
                                        // Ẩn outline khi chưa focus
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                        },
                                        // Hiện outline khi focus vào
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                border: '1px solid #121212',
                                            }
                                        },
                                    },
                                    theme.applyStyles('dark', {
                                        bgcolor: 'hsla(0,0%,100%,.1)',
                                        '& .MuiOutlinedInput-root': {
                                            '&.Mui-focused fieldset': {
                                                border: '1px solid #fff',
                                            }
                                        },
                                    })
                                ]}
                                onChange={(e) =>
                                    setNewPlaylist(({ ...newPlaylist, title: e.target.value }))
                                    // setTitle(e.target.value)
                                }
                                value={newPlaylist.title}

                            />
                            <div className="flex justify-end">
                                <FormControlLabel
                                    control={
                                        <Switch checked={newPlaylist.isPubic} onChange={(event) => {
                                            setNewPlaylist({
                                                ...newPlaylist,
                                                isPubic: event.target.checked,
                                            });
                                        }} />
                                    }
                                    label="Public "
                                    labelPlacement="end"
                                    sx={{ marginRight: 0 }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button variant="contained" onClick={handleCreateEmptyPlaylist}>
                                Save
                            </Button>
                        </div>
                    </Stack>
                </Stack>
            </DialogContent>
        </BootstrapDialog>
    )
}

export default DialogCreatePlaylist;