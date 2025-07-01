'use client'
import Step2 from "./steps/step2";
import Step1 from "./steps/step1";
import { useTrackUpload } from "@/hooks/use.track.upload";

const TrackUpload = () => {
    const { isUploaded, setIsUploaded, trackUpload, setTrackUpload } = useTrackUpload();

    return (
        <>
            {!isUploaded
                ?
                <Step1
                    setIsUploaded={setIsUploaded}
                    setTrackUpload={setTrackUpload}
                    trackUpload={trackUpload}
                />
                :
                <Step2
                    trackUpload={trackUpload}
                />
            }
        </>
    )
}

export default TrackUpload;