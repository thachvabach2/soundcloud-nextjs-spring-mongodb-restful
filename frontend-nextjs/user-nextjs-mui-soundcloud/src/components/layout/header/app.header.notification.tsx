'use client'

import { Avatar, Badge, IconButton, Menu, MenuItem } from "@mui/material"
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import { useToast } from "@/hooks/toast";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getNotificationsByAUserWithPaginationAction } from "@/actions/actions.notification";
import { formatDistanceToNow, parseISO } from "date-fns";
import PersonIcon from '@mui/icons-material/Person';

const AppHeaderNotification = () => {
    const { data: session } = useSession();
    const toast = useToast();
    const [hasNotifications, setHasNotifications] = useState<boolean>(false);
    const [anchorElNotification, setAnchorElNotification] = useState<null | HTMLElement>(null);
    const [resNotification, setResNotification] = useState<INotification[]>([]);

    useEffect(() => {
        const connectWebSocket = () => {

            const sock = new SockJS(`http://localhost:8080/notification`);
            // console.log('run here')

            const client = Stomp.over(sock);
            // console.log('run here1')


            client.connect(
                { Authorization: `Bearer ${session?.access_token}` },
                () => {
                    toast.success("connected stomp");

                    client.subscribe(`/user/queue/notification`, (message) => {
                        // console.log(">>> received notification: ", message);
                        const newNotification = JSON.parse(message.body);
                        toast.success('Có người comment kìa')
                        setResNotification(prev => [newNotification, ...prev])
                        setHasNotifications(true);
                    })
                    // console.log('subscribed: ', `/user/${session?.user?._id}/queue/notification`)
                });

            return client;
        }

        let client: any;
        if (session?.user._id) {
            client = connectWebSocket();
        }

        // Cleanup WebSocket connection
        return () => {
            if (client) {
                client.disconnect();
            }
        };
    }, [session?.user._id])

    const handleOpenNotificationMenu = async (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNotification(event.currentTarget);
        const resNotification = await getNotificationsByAUserWithPaginationAction();

        if (resNotification.data) {
            setResNotification(resNotification.data.result)
            setHasNotifications(false);
        }
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
    };

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
            <IconButton onClick={handleOpenNotificationMenu}>
                <Badge variant={`${hasNotifications ? 'dot' : 'standard'}`} color="secondary" overlap="circular">
                    <NotificationsNoneOutlinedIcon />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorElNotification}
                open={Boolean(anchorElNotification)}
                onClose={handleCloseNotificationMenu}
                disableScrollLock={true}
                keepMounted
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
                        <div className="cursor-not-allowed">
                            Settings
                        </div>
                    </div>
                </div>
                <div className="overflow-y-auto max-h-[400px]">
                    {resNotification.map((item) => (
                        // <Link href={'/'} key={item._id}>
                        <MenuItem
                            key={item._id}
                        // selected={option === "Pyxis"}
                        // onClick={handleClose}
                        >
                            <div className="notificationBadge__row flex flex-row items-stretch w-full cursor-not-allowed">
                                <div className="badge-left-side flex items-center">
                                    <div className="mr-[16px]">
                                        <Avatar
                                            alt="avatar from user"
                                            // src="/static/images/avatar/1.jpg"
                                            sx={{ width: 48, height: 48 }}
                                        />
                                    </div>
                                </div>
                                <div className="badge-main flex-1 flex flex-col justify-between min-h-full">
                                    {item.type === 'COMMENT'
                                        &&
                                        <span className="text-[0.8rem] break-words whitespace-normal text-[#ccc] font-light">
                                            <span className="text-[#fff] font-bold">
                                                {item.fromUserId.slice(-4)}
                                            </span>
                                            <span>
                                                &nbsp;&nbsp;commented {item.entityId.slice(-4)} on your trackkkk
                                            </span>
                                        </span>
                                    }
                                    <span className="text-[0.85rem] text-[#ccc] flex items-center space-x-1">
                                        <span>
                                            <PersonIcon sx={{ width: 16, height: 16 }} />
                                        </span>
                                        <span>
                                            {formatTimeAgo(item?.createdAt ?? 0)}
                                        </span>
                                    </span>
                                </div>
                                <div className="badge-right-side flex items-center">
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
                        // </Link>
                    ))}
                </div>
                <div className='sticky bottom-0 bg-gray-500 z-0 cursor-not-allowed'>
                    <div className="flex justify-center items-center py-[8px] px-[16px]">
                        <span>
                            View all notifications
                        </span>
                    </div>
                </div>
            </Menu>
        </>
    )
}

export default AppHeaderNotification;