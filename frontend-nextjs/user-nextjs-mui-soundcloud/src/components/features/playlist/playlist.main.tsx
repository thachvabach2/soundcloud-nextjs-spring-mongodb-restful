import { Box, Grid, Stack } from "@mui/material";
import HeadphonesIcon from '@mui/icons-material/Headphones';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Link from "next/link";

interface IProps {
    playlists: IPlaylist[];
}

const PlaylistMain = (props: IProps) => {
    const { playlists } = props;

    return (
        <div className="main-content px-[14px]">
            <Grid component={'ul'} container>
                {playlists?.map(playlist => {
                    return (
                        <Grid component={'li'} size={{ xs: 6, sm: 4, md: 3, lg: 2 }} key={playlist._id}>
                            <Link href={`/playlist/${playlist._id}`}>
                                <Stack
                                    className="p-[12px] cursor-pointer relative z-0"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#dddddd',
                                            borderRadius: '6px',

                                            '.player': {
                                                transform: 'translateY(-8px)',
                                                opacity: 1,
                                                transition: 'all .3s ease',
                                            }
                                        }
                                    }}
                                    spacing={1}
                                >
                                    <div className="top-side">
                                        <div>
                                            <div className="relative w-full bg-[#333] rounded-[6px] pb-[100%]">
                                                <div className="absolute h-full w-full flex justify-center items-center">
                                                    <HeadphonesIcon sx={{ fontSize: 70, color: '#b3b3b3' }} />
                                                </div>
                                                <Box
                                                    className="player absolute rounded-[50%] opacity-0 pointer-events-auto bottom-0 right-[8px]"
                                                    component={'div'}
                                                >
                                                    <div className="border-0 rounded-[9999px] cursor-pointer relative inline-block text-center">
                                                        <button
                                                            className="bg-[#1ed760] rounded-[9999px] relative flex items-center justify-center text-center cursor-pointer hover:scale-[1.04] hover:bg-[#3be477]"
                                                            style={{ blockSize: '48px', inlineSize: '48px' }}
                                                        >
                                                            <PlayArrowIcon sx={{ fontSize: 28 }} />
                                                        </button>
                                                    </div>
                                                </Box>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bottom-side" style={{ display: 'flex', alignItems: 'center' }}>
                                        <Stack>
                                            <div style={{ display: 'flex' }}>
                                                <span className="text-[1rem] font-medium hover:text-[hsla(0,0%,40%,0.4)]">
                                                    {playlist?.title}
                                                </span>
                                            </div>
                                            <div className="flex">
                                                <span className="text-[0.875rem] font-medium text-[#666] hover:text-[hsla(0,0%,40%,0.4)]">
                                                    {playlist?.user?.name}
                                                </span>
                                            </div>
                                        </Stack>
                                    </div>
                                </Stack>
                            </Link>
                        </Grid>
                    )
                })}

            </Grid>
        </div >
    )
}

export default PlaylistMain;