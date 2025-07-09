
import { useEffect, useState } from 'react';
import type { TableProps } from 'antd';
import { Button, notification, Popconfirm, Table } from 'antd';

export interface IUser {
    _id: string;
    email: string;
    name: string;
    role: string;
    type: string;
}

export interface ITrack {
    _id: string;
    title: string;
    description: string;
    trackUrl: string;
}

export interface IComments {
    _id: string;
    content: string;
    moment: number;
    user: IUser;
    track: ITrack;
    isDeleted: boolean;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

const CommentsTable = () => {
    const [notificationApi, contextHolder] = notification.useNotification();

    const [listTrack, setListTrack] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);

    const access_token = localStorage.getItem('access_token') as string;

    useEffect(() => {
        getData();
    }, [current, pageSize]);

    const getData = async () => {
        setIsLoading(true);

        const res = await fetch(`http://localhost:8080/api/v1/comments?page=${current}&size=${pageSize}`,
            {
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )

        const d = await res.json();
        if (!d.data) {
            notificationApi.error({
                message: JSON.stringify(d.message)
            })
        }
        setListTrack(d.data.result);
        setTotal(d.data.meta.totalElement)
        setIsLoading(false);
    }

    const columns: TableProps<IComments>['columns'] = [
        {
            title: 'STT',
            dataIndex: 'stt',
            render: (value, record, index) => {
                return (
                    <>{((current - 1) * pageSize) + index + 1}</>
                )
            },
        },
        {
            title: 'Content',
            dataIndex: 'content',
        },
        {
            title: 'Track',
            dataIndex: ['track', 'title'],
        },
        {
            title: 'User',
            dataIndex: ['user', 'email'],
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (value, record, index) => {
                return (
                    <div>
                        <Popconfirm
                            title="Delete the track"
                            description={`Are you sure to delete this comment = ${record.content}?`}
                            onConfirm={() => handleDeleteTrack(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button color="danger" variant="solid" >
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>
                )
            },
        },
    ]

    const handleDeleteTrack = async (comment: IComments) => {
        const res = await fetch(`http://localhost:8080/api/v1/comments/${comment._id}`,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
            }
        )

        const d = await res.json();
        if (d.data) {
            await getData();
            notificationApi.success({
                message: "Xóa track thành công",
            })
        } else {
            notificationApi.error({
                message: "Có lỗi xảy ra",
                description: JSON.stringify(d.message),
            })
        }
    };

    const handleOnChange = (page: number, pageSizeChange: number) => {
        setCurrent(page);
        if (pageSize != pageSizeChange) {
            setPageSize(pageSizeChange);
            setCurrent(1);
        }
    }

    return (
        <div>
            {contextHolder}
            <div className='flex justify-between align-middle my-7'>
                <h2 className='text-4xl font-semibold'>Table Comments</h2>
            </div>

            <Table<IComments>
                rowKey={"_id"}
                columns={columns}
                dataSource={listTrack}
                pagination={
                    {
                        defaultCurrent: 1,
                        current: current,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        responsive: true,
                        showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} items</div>) },
                        onChange: (page: number, pageSize: number) => handleOnChange(page, pageSize)
                    }
                }

                loading={isLoading}
            />
        </div>
    )
}

export default CommentsTable;