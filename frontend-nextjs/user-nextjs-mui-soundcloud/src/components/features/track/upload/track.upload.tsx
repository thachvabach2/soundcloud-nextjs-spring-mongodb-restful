'use client'
import Step2 from "./steps/step2";
import Step1 from "./steps/step1";
import { useTrackUpload } from "@/hooks/use.track.upload";

const TrackUpload = () => {
    const { isUploaded, file, handleFileUpload, goBack } = useTrackUpload();

    return (
        <>
            {!isUploaded
                ?
                <Step1 onFileUploaded={handleFileUpload} />
                :
                <Step2 file={file} onBack={goBack} />
            }
        </>
    )
}

export default TrackUpload;