'use client'

import { useWavesurfer } from "@/hooks/use.wavesurfer";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import { LightTooltip } from "@/components/ui/track/LightTooltip";

const WaveTrack = () => {
    const searchParams = useSearchParams();
    const fileName = searchParams.get('audio');
    // console.log('>>> check client searchParam: ', searchParams);

    const pathname = usePathname();
    // console.log('>>> check pathname: ', pathname)

    const containerRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

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
        const secondsRemainder = Math.round(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);
        return `${minutes}:${paddedSeconds}`;
    }

    useEffect(() => {
        if (!wavesurfer) return;
        const unsubscribeFns = [
            // callback
            wavesurfer.on('play', () => { setIsPlaying(true) }),
            wavesurfer.on('pause', () => { setIsPlaying(false) }),
            wavesurfer.on('timeupdate', (currentTime) => (timeRef.current!.textContent = formatTime(currentTime))),
            wavesurfer.on('decode', (duration) => (durationRef.current!.textContent = formatTime(duration))),
        ]
        containerRef.current?.addEventListener('pointermove', (e) => (hoverRef.current!.style.width = `${e.offsetX}px`))
        return () => { unsubscribeFns.forEach((fn) => fn()) }
    }, [wavesurfer])

    const arrComments = [
        {
            id: 1,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 10,
            user: "username 1",
            content: "just a comment1"
        },
        {
            id: 2,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 30,
            user: "username 2",
            content: "just a comment3"
        },
        {
            id: 3,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 50,
            user: "username 3",
            content: "just a comment3"
        },
    ]

    const calLeft = (moment: number) => {
        const hardCodeDuration = 256
        const percent = (moment / hardCodeDuration) * 100;
        return `${percent}%`
    }

    console.log('>>>> check render.........')
    return (
        <div className="listen-hero">
            <div className="fullListenHero mx-6 relative h-96 overflow-hidden">
                <div className="backgroundGradient h-full bg-gradient-to-br from-[#6c6156] to-[#191c1f]">
                </div>
                <div className="fullHero__foreground absolute left-0 top-0 w-full h-full box-border pt-8 pr-[574px] pb-8 pl-8">
                    <div className="fullHero_artwork absolute top-8 right-8 z-1">
                        <div className="image_lightOutline h-full w-full rounded-[3%] bg-linear-[135deg,#70929c,#e6846e]">
                            <span className="h-80 w-80 rounded-[3%] bg-cover bg-[url('/audio/phep-mau.png')] block" />
                        </div>
                    </div>
                    <div className="fullHero_title">
                        <div className="soundTitle break-all">
                            <div className="soundTitle__titleContainer flex items-start">
                                <div className="soundTitle_playButton self-start mr-4" onClick={() => onPlayPause()}>
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
                                    <div className="text-[28px] font-medium bg-[#121212] text-[#fff] px-2 py-1 line-clamp-2">
                                        <span>
                                            Karik ft. GDucky - Bạn Đời (Lo-fi ver by Hawys)
                                        </span>
                                    </div>
                                    <div className="text-[#999] bg-[#121212] inline py-1 px-2">
                                        Hawys.
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
                                R&B & Soul R&B & Soul R&B & Soul R&B & Soul
                            </span>
                        </div>
                    </div>
                    <div className="fullHero_playerArea absolute bottom-8 left-8 right-[392px]">
                        <div className="fullHero_waveform mb-8 h-[100px]">
                            <div
                                ref={containerRef}
                                className="group cursor-pointer relative"
                            >
                                <div
                                    ref={timeRef}
                                    className="time absolute z-11 top-1/2 mt-[-1px] transform-[-translate-y-1/2] text-[11px] bg-black/75 px-0.5 text-[#ddd] left-0"
                                >
                                    0:00
                                </div>
                                <div
                                    ref={durationRef}
                                    className="duration absolute z-11 top-1/2 mt-[-1px] transform-[-translate-y-1/2] text-[11px] bg-black/75 px-0.5 text-[#ddd] right-0"
                                >
                                    0:00
                                </div>
                                <div
                                    ref={hoverRef}
                                    className="hover-class absolute left-0 top-0 z-10 pointer-events-none w-0 mix-blend-plus-lighter bg-[#e24d27] opacity-0 transition-opacity duration-200 ease-in-out h-full group-hover:opacity-100"
                                ></div>
                                <div className="overplay absolute h-[30px] bottom-0 w-full backdrop-brightness-50">
                                </div>
                                <div className="comments relative flex flex-row">
                                    {
                                        arrComments.map(item => {
                                            return (
                                                <LightTooltip title={item.content} arrow key={item.id}>
                                                    <img
                                                        className="h-[24px] w-[24px] absolute top-[67px] z-20 rounded-[50%]"
                                                        onPointerMove={(e) => {
                                                            hoverRef.current!.style.width = calLeft(item.moment)
                                                        }}
                                                        style={{
                                                            left: calLeft(item.moment)
                                                        }}
                                                        src={`http://localhost:8080/images/phep-mau.jpg`}
                                                    />
                                                </LightTooltip>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WaveTrack;