'use client'

import { useWavesurfer } from "@/hooks/use.wavesurfer";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const WaveTrack = () => {
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    const optionsMemo = useMemo(() => {
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: `/api?audio=${fileName}`,
        }
    }, [])

    const wavesurfer = useWavesurfer(containerRef, optionsMemo);

    useEffect(() => {
        if (!wavesurfer) return;
        const unsubscribeFns = [
            // callback
            wavesurfer.on('play', () => { setIsPlaying(true) }),
            wavesurfer.on('pause', () => { setIsPlaying(false) }),
        ]
        return () => { unsubscribeFns.forEach((fn) => fn()) }
    }, [wavesurfer])

    const onPlayPause = useCallback(() => {
        wavesurfer && wavesurfer.playPause();
    }, [wavesurfer])

    console.log('>>>> check wavesurfer?.isPlaying(): ', wavesurfer?.isPlaying())
    return (
        <>
            <div ref={containerRef}>
                wave track
            </div>
            <button onClick={() => onPlayPause()}>
                {isPlaying === true ? 'Pause' : 'Play'}
            </button>

        </>
    )
}

export default WaveTrack;