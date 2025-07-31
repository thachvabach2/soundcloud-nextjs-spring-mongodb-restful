import PlaylistHeader from "./playlist.header";
import PlaylistMain from "./playlist.main";

interface IProps {
    playlists: IPlaylist[];
}

const PlaylistTrack = (props: IProps) => {
    const { playlists } = props;

    return (
        <>
            <PlaylistHeader />
            <PlaylistMain
                playlists={playlists}
            />
        </>
    )
}

export default PlaylistTrack;