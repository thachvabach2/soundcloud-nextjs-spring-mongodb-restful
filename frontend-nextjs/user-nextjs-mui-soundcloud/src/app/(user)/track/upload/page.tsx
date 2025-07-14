import TrackUpload from "@/components/features/track/upload/track.upload";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Upload your music & audio and share it with the world. on SoundCloud",
    description: 'Play User and discover followers on SoundCloud | Stream tracks, albums, playlists on desktop and mobile.',
}

const UploadPage = () => {
    return (
        <>
            <TrackUpload />
        </>
    )
}

export default UploadPage;