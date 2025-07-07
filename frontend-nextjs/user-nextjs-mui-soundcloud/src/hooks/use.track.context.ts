
import { TrackContext } from "@/context/track.context.provider";
import { useContext } from "react"

export const useTrackContext = () => {
    const context = useContext(TrackContext);

    if (!context) {
        throw new Error('usePlay must be used within a PlayContextProvider');
    }

    return context;
}