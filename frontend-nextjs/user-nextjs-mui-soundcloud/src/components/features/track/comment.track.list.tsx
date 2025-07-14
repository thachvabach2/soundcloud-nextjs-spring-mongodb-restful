import { Avatar, Box, Button, Grid, IconButton, Stack, Typography } from "@mui/material";
import React, { MouseEvent } from "react";
import WaveSurfer from "wavesurfer.js";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fetchDefaultImages } from "@/lib/utils/api";
import Link from "next/link";

interface IProps {
    wavesurfer: WaveSurfer | null;
    listComment: IModelPaginate<ITrackComment> | null;
}

const CommentTrackList = (props: IProps) => {
    const { wavesurfer, listComment } = props;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secondsRemainder = Math.floor(seconds) % 60;
        const paddedSeconds = `0${secondsRemainder}`.slice(-2);
        return `${minutes}:${paddedSeconds}`;
    }

    const handleJumpTrack = (moment: number) => {
        if (wavesurfer) {
            wavesurfer?.setTime(moment);
            wavesurfer?.play()
        }
    }

    const formatTimeAgo = (createdAt: string) => {
        try {
            const date = parseISO(createdAt);

            const timeAgo = formatDistanceToNow(date, {
                addSuffix: true
            });

            return timeAgo;
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'unknown time';
        }
    }

    return (
        <>
            <Stack
                direction={'column'}
                className="commentsList"
            >
                <Stack
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    className="commentsList__header"
                    sx={{ pb: '7px' }}
                >
                    <Typography
                        component={'h3'}
                        variant="h5"
                        sx={{ py: '8px' }}
                    >
                        <span>{listComment?.meta?.totalElement} comments</span>
                    </Typography>
                    <Box component={'div'} className="commentsList__sortSelect">
                        <Button
                            variant="contained"
                            sx={{ textTransform: 'none' }}
                        >
                            Sorted by: Newest
                        </Button>
                    </Box>
                </Stack>
            </Stack>
            <Stack component={'ul'} className="lazyLoadingList__list" spacing={5} sx={{ mt: '16px' }}>

                {listComment?.result?.map(comment => {
                    return (
                        <Grid container component={'li'} className="commentsList__item" key={comment._id}>
                            <Grid size={1} component={'div'} className="commentItem__avatarWrapper">
                                <IconButton sx={{ p: 0 }}>
                                    <Avatar
                                        alt="avatar"
                                        src={fetchDefaultImages(comment.user.type)}
                                        sx={{ width: '50px', height: '50px' }}
                                    />
                                </IconButton>
                            </Grid>
                            <Grid size={11} component={'div'} className="commentItem__content" sx={{ flexDirection: 'column' }}>
                                <Stack direction={'row'} className="commentItem__commentInfo">
                                    <Box
                                        sx={{
                                            fontWeight: 600,
                                            cursor: 'pointer',

                                            '&:hover': {
                                                color: 'hsla(0,0%,40%,0.4)'
                                            }
                                        }}
                                    >
                                        <Link href={`/profile/${comment.user._id}`}>
                                            {comment?.user?.name ?? comment?.user?.email}
                                        </Link>
                                    </Box>
                                    <span>&nbsp;at&nbsp;</span>
                                    <Box component={'span'}
                                        sx={{
                                            fontWeight: 600,
                                            color: '#666',
                                            cursor: 'pointer',

                                            '&:hover': {
                                                color: 'hsla(0,0%,40%,0.4)'
                                            }
                                        }}
                                        onClick={() => handleJumpTrack(comment.moment)}
                                    >
                                        {formatTime(comment?.moment)}
                                    </Box>
                                    <span>&nbsp;- {formatTimeAgo(comment?.updatedAt)}</span>
                                </Stack>
                                <Box component={'div'} className="commentItem__body" sx={{ mt: '6px' }}>
                                    <span>
                                        {comment?.content}
                                    </span>
                                </Box>
                            </Grid>
                        </Grid>
                    )
                })}

            </Stack>
        </>
    )
}

export default CommentTrackList;