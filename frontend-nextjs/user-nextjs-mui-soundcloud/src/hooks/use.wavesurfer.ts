import { useState, useEffect } from 'react';
import WaveSurfer, { WaveSurferOptions } from 'wavesurfer.js';

export const useWavesurfer = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    options: Omit<WaveSurferOptions, 'container'>
) => {
    const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null)

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!containerRef.current) return

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
            renderFunction: (peaks, ctx) => {
                const { width, height } = ctx.canvas;
                const halfHeight = height / 1.5;
                const barWidth = options.barWidth || 2;
                const barRadius = options.barRadius || 0;
                const barGap = 1;
                const totalBarWidth = barWidth + barGap;

                ctx.clearRect(0, 0, width, height);

                const numBars = Math.floor(width / totalBarWidth);
                const channelData = peaks[0];

                for (let i = 0; i < numBars; i++) {
                    const x = i * totalBarWidth;
                    const dataIndex = Math.floor((i / numBars) * channelData.length);
                    const sample = Math.abs(channelData[dataIndex] || 0);

                    // Tăng mạnh độ cao và normalize
                    const normalizedSample = Math.pow(sample, 0.5); // Square root để tăng các giá trị nhỏ
                    const amplifiedSample = Math.max(normalizedSample * 1.6, 0.01); // Tăng 4x
                    const maxBarHeight = halfHeight * 1.2;
                    const totalBarHeight = Math.min(amplifiedSample * maxBarHeight, maxBarHeight);

                    const originalMin = 0;
                    const originalMax = maxBarHeight;
                    const targetMin = 30;
                    const targetMax = maxBarHeight;

                    // (0, 100) -> (30, 100)
                    const totalBarHeightNormalized = targetMin + (totalBarHeight - originalMin) * (targetMax - targetMin) / (originalMax - originalMin);

                    // 70% trên, 30% dưới
                    const topBarHeight = totalBarHeightNormalized * 0.7;
                    const bottomBarHeight = totalBarHeightNormalized * 0.3;

                    const topY = halfHeight - topBarHeight;
                    const bottomY = halfHeight;

                    // Vẽ bars
                    if (topBarHeight > 1) {
                        if (barRadius > 0) {
                            ctx.beginPath();
                            ctx.roundRect(x, topY, barWidth, topBarHeight, barRadius);
                            ctx.fill();
                        } else {
                            ctx.fillRect(x, topY, barWidth, topBarHeight);
                        }
                    }

                    if (bottomBarHeight > 1) {
                        if (barRadius > 0) {
                            ctx.beginPath();
                            ctx.roundRect(x, bottomY, barWidth, bottomBarHeight, barRadius);
                            ctx.fill();
                        } else {
                            ctx.fillRect(x, bottomY, barWidth, bottomBarHeight);
                        }
                    }
                }

                ctx.fill();
            }
        })

        setWavesurfer(ws)

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return wavesurfer
}