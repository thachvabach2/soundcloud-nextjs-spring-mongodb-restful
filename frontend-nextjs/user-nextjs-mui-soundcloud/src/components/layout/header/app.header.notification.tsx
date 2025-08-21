'use client'

import { Avatar, Badge, IconButton, Menu, MenuItem, TextField } from "@mui/material"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useToast } from "@/hooks/toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

const AppHeaderNotification = () => {
    const { data: session } = useSession();
    const toast = useToast();
    const [notification, setNotification] = useState<INotification[]>([]);
    const [anchorElNotification, setAnchorElNotification] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const connectWebSocket = () => {

            const sock = new SockJS(`http://localhost:8080/notification`);
            console.log('run here')

            const client = Stomp.over(sock);
            console.log('run here1')


            client.connect(
                { Authorization: `Bearer ${session?.access_token}` },
                () => {
                    toast.success("connected stomp");

                    client.subscribe(`/user/queue/notification`, (message) => {
                        console.log(">>> received notification: ", message);
                        const newMessage = JSON.parse(message.body);
                        toast.success('Có người comment kìa')
                        setNotification((prev) => [...prev, newMessage]);
                    })
                    console.log('subscribed: ', `/user/${session?.user?._id}/queue/notification`)
                });
        }
        if (session?.user._id) {
            connectWebSocket();
        }
    }, [session?.user._id])

    const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNotification(event.currentTarget);
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
    };

    const options = [
        "None",
        "Atria",
        "Callisto",
        "Dione",
        "Ganymede",
        "Hangouts Call",
        "Luna",
        "Oberon",
        "Phobos",
        "Pyxis",
        "Sedna",
        "Titania",
        "Triton",
        "Umbriel"
    ];

    console.log('>>> check notification in header: ', notification)

    return (
        <>
            <IconButton onClick={handleOpenNotificationMenu}>
                <Badge variant={`${notification.length > 0 ? 'dot' : 'standard'}`} color="secondary" overlap="circular">
                    <NotificationsNoneOutlinedIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorElNotification}
                open={Boolean(anchorElNotification)}
                onClose={handleCloseNotificationMenu}
                disableScrollLock={true}
                keepMounted
                marginThreshold={0}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            // maxHeight: '494px',
                            width: '400px',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            overflow: 'hidden'
                        },
                    },
                    list: {
                        sx: {
                            pt: 0,
                        }
                    }
                }}
            >
                <div className='sticky top-0 bg-gray-500 z-2 pt-[5px]'>
                    <div className="flex justify-between items-center py-[8px] px-[16px]">
                        <span className="text-2xl">
                            Notifications
                        </span>
                        <div>
                            Settings
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[400px]">
                    {options.map((option) => (
                        <MenuItem
                            key={option}
                        // selected={option === "Pyxis"}
                        // onClick={handleClose}
                        >
                            <div className="notificationBadge__row flex flex-row items-center w-full">
                                <div className="badge-left-side">
                                    <div className="mr-[16px]">
                                        <Avatar
                                            alt="avatar from user"
                                            // src="/static/images/avatar/1.jpg"
                                            sx={{ width: 48, height: 48 }}
                                        />
                                    </div>
                                </div>
                                <div className="badge-main flex-1">
                                    {option}
                                </div>
                                <div className="badge-right-side">
                                    <div className="ml-[16px]">
                                        <Avatar
                                            alt="avatar from user"
                                            // src="/static/images/avatar/1.jpg"
                                            variant="square"
                                            sx={{ width: 48, height: 48 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </MenuItem>
                    ))}
                </div>
            </Menu>
        </>
    )
}

export default AppHeaderNotification;