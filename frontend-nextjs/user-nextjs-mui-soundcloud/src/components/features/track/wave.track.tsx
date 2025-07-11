'use client'

import { useWavesurfer } from "@/hooks/use.wavesurfer";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import { LightTooltip } from "@/components/ui/track/LightTooltip";
import { useTrackContext } from "@/hooks/use.track.context";
import { Box, Grid } from "@mui/material";
import CommentTrackArtistInfo from "./comment.track.artist.info";
import CommentTrackList from "./comment.track.list";
import CommentTrackForm from "./comment.track.form";
import { useSession } from "next-auth/react";
import { fetchDefaultImages } from "@/lib/utils/api";

interface IProps {
    track: ITrackTop | null
    listComment: IModelPaginate<ITrackComment> | null
}

export interface CommentFormRef {
    setFocused: () => void;
}

const WaveTrack = (props: IProps) => {
    const { track, listComment } = props;
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    const trackId = searchParams.get('id')

    const pathname = usePathname();

    const containerRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);

    const { currentTrack, setCurrentTrack } = useTrackContext();

    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [momentSecondComment, setMomentSecondComment] = useState<number>(-1);
    const [isWavesurferReady, setIsWavesurferReady] = useState<boolean>(false);

    const commentInputRef = useRef<HTMLInputElement | null>(null);
    const commentPlaceholderRef = useRef<HTMLDivElement | null>(null);
    const childRef = useRef<CommentFormRef>(null);

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        let gradient, progressGradient;

        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.45)
            gradient.addColorStop(0, '#ffffff') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#ffffff') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#121212') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#121212') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.45)
            progressGradient.addColorStop(0, '#ff7000') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#ff3700') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#121212') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#121212') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }

        return {
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 2,
            barRadius: 2,
            url: `/api?audio=${fileName}`,
        }
    }, [])

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause();
    }, [wavesurfer])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.floor(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);
        return `${minutes}:${paddedSeconds}`;
    }

    useEffect(() => {
        if (!wavesurfer) return;
        const unsubscribeFns = [
            // callback
            wavesurfer.on('ready', () => { setIsWavesurferReady(true) }),
            wavesurfer.on('play', () => { setIsPlaying(true) }),
            wavesurfer.on('pause', () => { setIsPlaying(false) }),
            wavesurfer.on('timeupdate', (currentTime) => (timeRef.current!.textContent = formatTime(currentTime))),
            wavesurfer.on('decode', (duration) => (durationRef.current!.textContent = formatTime(duration))),
        ]
        containerRef.current?.addEventListener('pointermove', (e) => (hoverRef.current!.style.width = `${e.offsetX}px`))
        return () => { unsubscribeFns.forEach((fn) => fn()) }
    }, [wavesurfer])

    useEffect(() => {
        if (wavesurfer && currentTrack.isPlaying) {
            wavesurfer.pause()
        }
    }, [currentTrack])

    useEffect(() => {
        if (track?._id && !currentTrack.isPlaying) {
            setCurrentTrack({ ...track, isPlaying: false })
        }
    }, [track])

    const calLeft = (moment: number) => {
        const hardCodeDuration = wavesurfer?.getDuration() ?? 0;

        const percent = (moment / (hardCodeDuration ?? 666)) * 100;
        return `${percent}%`
    }

    const calMomentFromOffsetX = (offsetX: number) => {
        const hardCodeDuration = wavesurfer?.getDuration() ?? 0;
        const totalWidth = commentPlaceholderRef.current?.getBoundingClientRect().width;

        const percent = offsetX / totalWidth!;

        return Math.floor(percent * (hardCodeDuration ?? 666));
    }

    const handleTriggerCommentRef = (e: React.MouseEvent<HTMLDivElement>) => {
        commentInputRef.current?.focus();
        setMomentSecondComment(calMomentFromOffsetX(e.nativeEvent.offsetX));

        childRef.current?.setFocused();
    }

    return (
        <>
            <div className="listen-hero">
                <div className="fullListenHero relative h-96 overflow-hidden">
                    <div className="backgroundGradient h-full bg-gradient-to-br from-[#6c6156] to-[#191c1f]">
                    </div>
                    <div className="fullHero__foreground absolute left-0 top-0 w-full h-full box-border pt-8 pr-[574px] pb-8 pl-8">
                        <div className="fullHero_artwork absolute top-8 right-8 z-1">
                            <div className="image_lightOutline h-full w-full rounded-[3%] bg-linear-[135deg,#70929c,#e6846e]">
                                <span className="h-80 w-80 rounded-[3%] bg-cover block"
                                    style={{ backgroundImage: `url('${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}')` }}
                                />
                            </div>
                        </div>
                        <div className="fullHero_title">
                            <div className="soundTitle break-all">
                                <div className="soundTitle__titleContainer flex items-start">
                                    <div className="soundTitle_playButton self-start mr-4"
                                        onClick={() => {
                                            onPlayPause();
                                            if (track && wavesurfer) {
                                                setCurrentTrack(prev => ({
                                                    ...prev,
                                                    isPlaying: false
                                                }))
                                            }
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
                                                {track?.title} - {track?.artist}
                                            </span>
                                        </div>
                                        <div className="text-[#999] bg-[#121212] inline py-1 px-2">
                                            {track?.uploader?.name}
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
                            <div className="fullHero_tag text-sm box-border inline-block h-5.5 rounded-[100px] bg-[#f3f3f3] py-0.5 px-2 before:content-['#'] before:block before:float-left before:mr-[3px]">
                                <span className="overflow-hidden whitespace-nowrap text-ellipsis break-normal max-w-[120px] inline-block">
                                    {track?.category}
                                </span>
                            </div>
                        </div>
                        <div className="fullHero_playerArea absolute bottom-8 left-8 right-[392px]">
                            <div className="fullHero_waveform mb-8 h-[100px]">
                                <div className="waveformWrapper relative w-full h-full">
                                    <div className="waveformWrapper__waveform absolute left-0 right-0 top-0 bottom-0">
                                        <div className="waveform loaded relative w-full h-full opacity-100">
                                            <div className="waveform__layer absolute top-0 left-0 w-full h-full">
                                                <div
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
                                                </div>
                                            </div>
                                            <div className="commentPopover relative flex flex-row">
                                                {
                                                    isWavesurferReady &&
                                                    listComment?.result?.map(item => {
                                                        return (
                                                            <LightTooltip title={item.content} arrow key={item._id}>
                                                                <img
                                                                    className={`h-[24px] w-[24px] absolute top-[67px] z-40 rounded-[50%] cursor-pointer ${momentSecondComment != -1 && 'opacity-20'}`}
                                                                    onPointerMove={(e) => {
                                                                        hoverRef.current!.style.width = calLeft(item.moment)
                                                                    }}
                                                                    onClick={(e) => { e.preventDefault() }}
                                                                    style={{
                                                                        left: calLeft(item.moment)
                                                                    }}
                                                                    src={fetchDefaultImages(item.user.type)}
                                                                />
                                                            </LightTooltip>
                                                        )
                                                    })
                                                }
                                            </div>
                                            <div
                                                ref={commentPlaceholderRef}
                                                className="commentPlaceholder relative w-full h-[35px] bottom-0 top-[67%] cursor-pointer z-30"
                                                onClick={handleTriggerCommentRef}
                                            >
                                                <div
                                                    className="commentPlaceholder__avatar absolute top-0 z-1"
                                                    style={{
                                                        left: `${calLeft(momentSecondComment)}`,
                                                        opacity: `${momentSecondComment == -1 ? '0' : '1'}`
                                                    }}
                                                    onClick={(e) => { e.stopPropagation() }}
                                                >
                                                    <img
                                                        className={`min-h-[24px] min-w-[24px] max-h-[24px] max-w-[24px] rounded-[50%] ${momentSecondComment == -1 ? 'cursor-pointer' : 'cursor-move'} `}
                                                        alt="avatar"
                                                        src={fetchDefaultImages(session ? session.user.type : "USER")}
                                                        onClick={(e) => { e.stopPropagation() }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Box
                component={'div'}
                className="listen-about-main"
                sx={{ pt: '30px' }}
            >
                <Box
                    component={'div'}
                    className="about-rows"
                    sx={{
                        pb: '16px'
                    }}
                >
                    <CommentTrackForm
                        ref={childRef}
                        commentInputRef={commentInputRef}
                        track={track}
                        momentSecondComment={momentSecondComment}
                        setMomentSecondComment={setMomentSecondComment}
                        wavesurfer={wavesurfer}
                    />
                    <Box className="list-comment artistInfo">
                        <Grid container>
                            <Grid size={3}>
                                <CommentTrackArtistInfo
                                    track={track}
                                />
                            </Grid>
                            <Grid size={9}>
                                <CommentTrackList
                                    wavesurfer={wavesurfer}
                                    listComment={listComment}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default WaveTrack;