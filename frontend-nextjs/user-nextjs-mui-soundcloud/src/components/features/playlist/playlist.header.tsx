'use client'
import { Button, Chip, IconButton, InputBase, Paper, Stack, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import { useState } from "react";
import DialogCreatePlaylist from "./playlist.create.dialog";
import theme from "@/theme";

const PlaylistHeader = () => {
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    return (
        <>
            <div className="playlist-header px-[24px]">
                <header className="header-nav">
                    <Stack direction={'row'} sx={{ justifyContent: 'space-between', textAlign: 'center', alignItems: 'center' }}>
                        <div>
                            <span className="text-xl font-bold dark:text-[#fff]">
                                Your Playlist
                            </span>
                        </div>
                        <div>
                            <Chip
                                label={
                                    <Typography component={'span'} sx={{ fontWeight: 500 }}>
                                        Create
                                    </Typography>
                                }
                                icon={<AddIcon />}
                                sx={{ paddingY: '18px', paddingX: '2px', cursor: 'pointer' }}
                                onClick={() => setOpenDialog(true)}
                            />
                        </div>
                    </Stack>
                </header>
                <div className="header-actions">
                    <Stack direction={'row'} sx={{ paddingY: '15px', justifyContent: 'space-between' }}>
                        <div className="left-side">
                            <Stack direction={'row'} spacing={1}>
                                <Chip
                                    label={<Typography component={'span'} variant="body2">Playlists</Typography>}
                                    clickable
                                />
                                <Chip
                                    label={<Typography component={'span'} variant="body2">Artists</Typography>}
                                    clickable
                                />
                                <Chip
                                    label={<Typography component={'span'} variant="body2">Albums</Typography>}
                                    clickable
                                />
                            </Stack>
                        </div>
                        <div className="right-side">
                            <Stack direction={'row'} spacing={2}>
                                <Paper
                                    component="div"
                                    variant="outlined"
                                    sx={[
                                        {
                                            display: 'flex',
                                            alignItems: 'center',
                                            paddingLeft: '8px',
                                            backgroundColor: '#f3f3f3',
                                            border: 'none',
                                            paddingY: '2px'
                                        },
                                        theme.applyStyles('dark', {
                                            backgroundColor: 'hsla(0,0%,100%,.1)',
                                        })
                                    ]}
                                >
                                    <IconButton type="button" aria-label="search" sx={{ padding: '0px' }}>
                                        <SearchIcon />
                                    </IconButton>
                                    <InputBase
                                        sx={[
                                            {
                                                ml: 1,
                                                width: '188px',
                                                paddingRight: '32px',
                                                fontSize: '14px',
                                                '& input': { paddingY: '4px' }
                                            },
                                            theme.applyStyles('dark', {
                                                color: 'hsla(0,0%,100%,.7)',
                                            })
                                        ]}
                                        placeholder="Search in Your Playlist"
                                        inputProps={{ 'aria-label': 'Type to filter your playlist. The list of content below will update as you type.' }}
                                    />
                                </Paper>
                                <Button
                                    variant="text"
                                    endIcon={
                                        <GridViewIcon
                                            sx={[
                                                { mr: '4px' },
                                                theme.applyStyles('dark', {
                                                    color: '#b3b3b3'
                                                })
                                            ]}
                                        />
                                    }
                                    sx={{
                                        textTransform: 'none',
                                        color: '#121212',
                                        padding: '0px',
                                        '&:hover': {
                                            transform: 'scale(1.04)',
                                            backgroundColor: 'transparent',
                                            color: 'rgba(18,18,18,0.4)',
                                        }
                                    }}
                                >
                                    <span className="dark:text-[#b3b3b3]">
                                        Creator
                                    </span>
                                </Button>
                            </Stack>
                        </div>
                    </Stack>
                </div>
            </div>
            <DialogCreatePlaylist
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
        </>
    )
}

export default PlaylistHeader;