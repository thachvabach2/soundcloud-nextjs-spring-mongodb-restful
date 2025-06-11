'use client'

import { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";

const WaveTrack = () => {

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const wavesurfer = WaveSurfer.create({
                container: containerRef.current,
                waveColor: 'rgb(200, 0, 200)',
                progressColor: 'rgb(100, 0, 100)',
                url: 'http://localhost:8080/tracks/1749117587565-phep-mau.mp3',
            })
        }

    }, [])

    return (
        <div ref={containerRef}>
            wave track
        </div>
    )
}

export default WaveTrack;