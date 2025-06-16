'use client'

import { useWavesurfer } from "@/hooks/use.wavesurfer";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { WaveSurferOptions } from "wavesurfer.js";


const WaveTrack = () => {
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
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
            canvas.height = 70

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
            progressGradient.addColorStop(0, '#f59b64') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
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

    console.log('>>>> check render.........')
    return (
        <>
            <div
                ref={containerRef}
                className="group cursor-pointer relative w-[784px]"
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
                    className="hover-class absolute left-0 top-0 z-10 pointer-events-none w-0 mix-blend-plus-lighter bg-[#f0481d] opacity-0 transition-opacity duration-200 ease-in-out h-full group-hover:opacity-100"
                ></div>
                {/* wave track */}
            </div>
            <button onClick={() => onPlayPause()}>
                {isPlaying === true ? 'Pause' : 'Play'}
            </button>
        </>
    )
}

export default WaveTrack;