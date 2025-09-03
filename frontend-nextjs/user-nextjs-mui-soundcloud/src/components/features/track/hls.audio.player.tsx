
'use client';

import React, { useRef, useEffect, forwardRef } from 'react';
import H5AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Hls from 'hls.js';

interface HlsAudioPlayerProps {
    src: string;
    onPlay?: () => void;
    onPause?: () => void;
}

const HlsAudioPlayer = forwardRef<H5AudioPlayer, HlsAudioPlayerProps>(
    ({ src, onPlay, onPause }, ref) => {
        useEffect(() => {
            const hls = new Hls();

            if (Hls.isSupported() && ref && 'current' in ref) {
                hls.loadSource(src);
                hls.attachMedia(ref.current!.audio.current!);
            } else if (ref && 'current' in ref && ref.current?.audio?.current?.canPlayType('application/vnd.apple.mpegurl')) {
                ref.current.audio.current.src = src;
            }

            return () => {
                hls.destroy();
            };
        }, [src, ref]);

        return (
            <H5AudioPlayer
                ref={ref}
                src={src}
                onPlay={onPlay}
                onPause={onPause}
                crossOrigin='anonymous'
                className='audio-player'
                volume={0.8}
                layout='horizontal-reverse'
            />
        );
    }
);

HlsAudioPlayer.displayName = 'HlsAudioPlayer';

export default HlsAudioPlayer;