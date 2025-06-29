import { useState } from "react"
import { FileWithPath } from "react-dropzone"

export const useTrackUpload = () => {
    const [isUploaded, setIsUploaded] = useState<boolean>(false)
    const [file, setFile] = useState<FileWithPath | null>(null)

    const handleFileUpload = (uploadedFile: any) => {
        setFile(uploadedFile)
        setIsUploaded(true)
    }

    const goBack = () => setIsUploaded(false)

    return { isUploaded, file, handleFileUpload, goBack }
}