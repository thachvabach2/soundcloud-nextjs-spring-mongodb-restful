'use client'

import Image from "next/image";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import { useState } from "react";

interface IProps {
    playlist: IPlaylist;
}

const PlaylistDetailHeader = (props: IProps) => {
    const { playlist } = props;

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    return (
        <>
            <div className="listen-hero px-[24px]">
                <div className="fullListenHero relative h-96 overflow-hidden">
                    <div className="backgroundGradient h-full bg-gradient-to-br from-[#6c6156] to-[#191c1f]">
                    </div>
                    <div className="fullHero__foreground absolute left-0 top-0 w-full h-full box-border pt-8 pr-[574px] pb-8 pl-8">
                        <div className="fullHero_artwork absolute top-8 right-8 z-1">
                            <div className="image_lightOutline h-full w-full rounded-[3%] bg-linear-[135deg,#70929c,#e6846e]">
                                <Image
                                    className="rounded-[3%] bg-cover block"
                                    alt="track image"
                                    // src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
                                    src={'/user/default-google.png'}
                                    width={320}
                                    height={320}
                                // priority
                                />
                            </div>
                        </div>
                        <div className="fullHero_title">
                            <div className="soundTitle break-all">
                                <div className="soundTitle__titleContainer flex items-start">
                                    <div className="soundTitle_playButton self-start mr-4"
                                        onClick={() => {
                                            // onPlayPause();
                                            // handleIncreasePlay();
                                            // if (track && wavesurfer) {
                                            //     setCurrentTrack(prev => ({
                                            //         ...prev,
                                            //         isPlaying: false
                                            //     }))
                                            // }
                                        }}
                                    >
                                        {isPlaying ?
                                            <PauseCircleFilledIcon
                                                sx={{
                                                    cursor: 'pointer',
                                                    fontSize: 64,
                                                    '& svg': {
                                                        width: '100%',
                                                        height: '100%',
                                                    },
                                                    '& path': {
                                                        transform: 'scale(1.5)',
                                                        transformOrigin: 'center'
                                                    },
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent'
                                                    }
                                                }}
                                            />
                                            :
                                            <PlayCircleFilledIcon
                                                sx={{
                                                    cursor: 'pointer',
                                                    fontSize: 64,
                                                    '& svg': {
                                                        width: '100%',
                                                        height: '100%',
                                                    },
                                                    '& path': {
                                                        transform: 'scale(1.5)',
                                                        transformOrigin: 'center'
                                                    },
                                                    backgroundColor: '#fff',
                                                    borderRadius: '50%',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent'
                                                    }
                                                }}
                                            />
                                        }

                                    </div>
                                    <div className="soundTitle__usernameTitleContainer">
                                        <div className="text-[28px] font-medium bg-[#121212] text-[#fff] px-2 py-1 line-clamp-2 break-words break-keep">
                                            <span>
                                                {playlist?.title}
                                            </span>
                                        </div>
                                        <div className="text-[#999] bg-[#121212] inline py-1 px-2">
                                            {playlist?.user?.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="fullHero_info absolute top-8 right-98 text-right">
                            <div className="fullHero_uploadTime text-[#fff] mb-2">
                                <time className="relativeTime">
                                    3 months ago
                                </time>
                            </div>
                        </div>
                        <div className="fullHero_playerArea absolute bottom-8 left-8 right-[392px]">
                            <div className="fullHero_waveform mb-8 h-[100px]">
                                <div className="waveformWrapper relative w-full h-full">
                                    <div className="waveformWrapper__waveform absolute left-0 right-0 top-0 bottom-0">
                                        <div className="waveform loaded relative w-full h-full opacity-100">
                                            <div className="waveform__layer absolute top-0 left-0 w-full h-full">
                                                {/* <div
                                                    ref={containerRef}
                                                    className="group cursor-pointer relative"
                                                >
                                                    <div
                                                        ref={timeRef}
                                                        className="time absolute z-10 top-1/2 mt-[-1px] transform-[-translate-y-1/2] text-[11px] bg-black/75 px-0.5 text-[#ddd] left-0"
                                                        style={{ display: `${!isWavesurferReady ? 'none' : 'inline'}` }}
                                                    >
                                                        0:00
                                                    </div>
                                                    <div
                                                        ref={durationRef}
                                                        className="duration absolute z-10 top-1/2 mt-[-1px] transform-[-translate-y-1/2] text-[11px] bg-black/75 px-0.5 text-[#ddd] right-0"
                                                        style={{ display: `${!isWavesurferReady ? 'none' : 'inline'}` }}
                                                    >
                                                        0:00
                                                    </div>
                                                    <div
                                                        ref={hoverRef}
                                                        className="hoverWaveform absolute left-0 top-0 z-20 pointer-events-none w-0 mix-blend-plus-lighter bg-[#e24d27] opacity-0 transition-opacity duration-200 ease-in-out h-full group-hover:opacity-100"
                                                        style={{ display: `${!isWavesurferReady ? 'none' : 'inline'}` }}
                                                    ></div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PlaylistDetailHeader;