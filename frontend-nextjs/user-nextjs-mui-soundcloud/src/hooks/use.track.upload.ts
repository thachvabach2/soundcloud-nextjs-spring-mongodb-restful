import { useState } from "react"

export const useTrackUpload = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false)
    const [trackUpload, setTrackUpload] = useState({
        fileName: '',
        percent: 0,
        uploadedTrackName: '',
    })

    const goBack = () => setIsUploaded(false)

    return { isUploaded, setIsUploaded, trackUpload, setTrackUpload, goBack }
}