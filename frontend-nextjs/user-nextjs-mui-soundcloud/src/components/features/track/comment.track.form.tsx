'use client'
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import React, { Dispatch, forwardRef, RefObject, SetStateAction, useImperativeHandle, useRef } from "react";
import { CommentFormRef } from "./wave.track";
import { useSession } from "next-auth/react";
import { fetchDefaultImages } from "@/lib/utils/api";
import { createACommentOnATrackAction } from "@/actions/actions.comment";
import WaveSurfer from "wavesurfer.js";
import LikeTrack from "./like.track";

interface IProps {
    commentInputRef: RefObject<HTMLInputElement | null>;
    track: ITrackTop | null;
    momentSecondComment: number;
    setMomentSecondComment: Dispatch<SetStateAction<number>>;
    wavesurfer: WaveSurfer | null;
    listTrackLikedByAUser: IModelPaginate<ITrackLike> | null;
}

const CommentTrackForm = forwardRef<CommentFormRef, IProps>((props, ref) => {
    const { commentInputRef, track, momentSecondComment, setMomentSecondComment, wavesurfer, listTrackLikedByAUser } = props;
    const { data: session } = useSession();

    const wasAlreadyFocused = useRef(false);

    useImperativeHandle(ref, () => ({
        setFocused: () => {
            wasAlreadyFocused.current = true;
        },
    }));

    const handleSubmitComment = async (e: any) => {
        const content = commentInputRef.current?.value;

        if (content && track?._id) {
            const res = await createACommentOnATrackAction(content, momentSecondComment, track._id);

            if (res?.data) {
                setMomentSecondComment(-1);
                commentInputRef.current!.value = '';
            }
        }
    }

    const handleInputClick = () => {
        if (wasAlreadyFocused.current) {
            console.log('Already focused - ignoring click')
            return
        }
        if (!commentInputRef.current?.value) {
            setMomentSecondComment(Math.floor(wavesurfer?.getCurrentTime() ?? 0))
        }

        wasAlreadyFocused.current = true;
    }

    const handleInputBlur = () => {
        wasAlreadyFocused.current = false;
        if (!commentInputRef.current?.value) {
            setMomentSecondComment(-1);
        }
    }

    return (
        <Box className="listenEngagement" sx={{ mb: '30px' }}>
            <Stack direction={'column'} spacing={3}>
                <Stack
                    className="listenEngagement__commentForm"
                    direction={'row'}
                >
                    <Box
                        component={'div'}
                        className="commentForm__avatar"
                    >
                        <IconButton sx={{ p: 0 }}>
                            <Avatar
                                alt="avatar"
                                src={fetchDefaultImages(session?.user?.type ?? "USER")}
                            />
                        </IconButton>
                    </Box>
                    <Stack
                        className="commentForm__newCommentWrapper"
                        direction={'row'}
                        sx={{
                            ml: '16px',
                            flex: 1
                        }}
                    >
                        <TextField
                            inputRef={commentInputRef}
                            onBlur={handleInputBlur}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmitComment(e);
                                }
                            }}
                            hiddenLabel={true}
                            variant="standard"
                            autoComplete="off"
                            sx={{
                                width: '100%',
                                mr: '20px',
                                mt: '8px',
                            }}
                            placeholder="Write a comment"
                            onClick={handleInputClick}
                        />
                        <Box
                            component={'div'}
                            sx={{
                                display: "flex",
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                py: '3px',
                                px: '12px',
                                cursor: 'pointer',
                                backgroundColor: '#f3f3f3',

                                '&:hover svg': {
                                    opacity: 0.5
                                }
                            }}
                            onClick={(e) => handleSubmitComment(e)}
                        >
                            <SendOutlinedIcon sx={{ fontSize: '24px' }}
                            />
                        </Box>
                    </Stack>
                </Stack>
                <Stack
                    className="listenEngagement__footer"
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <LikeTrack
                        track={track}
                        listTrackLikedByAUser={listTrackLikedByAUser}
                    />
                </Stack>
            </Stack>
        </Box>
    )
}
)
export default CommentTrackForm;