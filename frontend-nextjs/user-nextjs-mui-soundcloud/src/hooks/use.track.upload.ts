import { useState } from "react"
import { FileWithPath } from "react-dropzone"

export const useTrackUpload = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false)
    const [trackUpload, setTrackUpload] = useState({
        fileName: '',
        percent: 0
    })

    const goBack = () => setIsUploaded(false)

    return { isUploaded, setIsUploaded, trackUpload, setTrackUpload, goBack }
}