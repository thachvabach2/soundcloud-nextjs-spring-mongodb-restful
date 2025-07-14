import { fetchDefaultImages } from "@/lib/utils/api";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "next/link";

interface IProps {
    track: ITrackTop | null;
}

const CommentTrackArtistInfo = (props: IProps) => {
    const { track } = props;

    return (
        <Stack sx={{ width: 150 }}>
            <Box component={'div'} className="userBadge__avatar" sx={{ mb: '8px' }}>
                <Link href={`/profile/${track?.uploader?._id}`}>
                    <IconButton sx={{ p: 0 }}>
                        <Avatar
                            alt="avatar"
                            src={fetchDefaultImages(track?.uploader?.type ?? "USER")}
                            sx={{ width: 150, height: 150 }}
                        />
                    </IconButton>
                </Link>
            </Box>
            <Box
                component={'div'}
                className="userBadge__title"
                sx={{ display: 'flex', justifyContent: 'center', mb: '16px' }}
            >
                <Typography
                    variant="body1"
                    fontWeight={600}

                    sx={{
                        '&:hover': {
                            color: 'hsla(0,0%,40%,0.4)',
                        }
                    }}
                >
                    <Link href={`/profile/${track?.uploader?._id}`}>
                        {track?.uploader?.name ?? track?.uploader?.email}
                    </Link>
                </Typography>
            </Box>
            <Button
                variant="contained"
                sx={{ textTransform: 'none' }}
            >
                <Typography sx={{ fontWeight: 500 }}>
                    Follow
                </Typography>
            </Button>
        </Stack>
    )
}

export default CommentTrackArtistInfo;