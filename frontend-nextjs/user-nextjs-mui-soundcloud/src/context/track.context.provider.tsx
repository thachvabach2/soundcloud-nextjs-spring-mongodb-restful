'use client'
import { createContext, useRef, useState } from "react";
import H5AudioPlayer from "react-h5-audio-player";

export const TrackContext = createContext<ITrackContext | null>(null);

export const TrackContextProvider = ({ children, }: Readonly<{ children: React.ReactNode; }>) => {
    const playerRef = useRef<H5AudioPlayer | null>(null)

    const initValue: IShareTrack = {
        _id: '',
        title: '',
        artist: '',
        description: '',
        category: '',
        imgUrl: '',
        trackUrl: '',
        countLike: 0,
        countPlay: 0,
        uploader: {
            _id: '',
            email: '',
            name: '',
            role: '',
            type: '',
        },
        isDeleted: false,
        createdAt: '',
        updatedAt: '',
        isPlaying: false
    }

    const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initValue);

    const value: ITrackContext = {
        currentTrack,
        setCurrentTrack
    }

    return (
        <>
            <TrackContext.Provider value={value}>
                {children}
            </TrackContext.Provider>
        </>
    )
}