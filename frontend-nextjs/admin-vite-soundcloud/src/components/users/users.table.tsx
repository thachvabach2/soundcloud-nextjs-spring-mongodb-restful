
import { useEffect, useState } from 'react';
// import '../../styles/users.css'
import { PlusCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, notification, Popconfirm, Table } from 'antd';
import CreateUserModal from './create.user.modal';
import UpdateUserModal from './update.user.modal';

export interface IUsers {
    _id: string;
    name: string;
    email: string;
    password: string;
    age: string;
    gender: string;
    address: string;
    role: string;
}

const UsersTable = () => {

    const [notificationApi, contextHolder] = notification.useNotification();

    const [listUser, setListUser] = useState([]);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [dataUpdate, setDataUpdate] = useState<null | IUsers>(null);

    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [total, setTotal] = useState<number>(0);

    const access_token = localStorage.getItem('access_token') as string;

    useEffect(() => {
        getData();
    }, [current, pageSize]);

    const getData = async () => {
        setIsLoading(true);

        const res = await fetch(`http://localhost:8080/api/v1/users?page=${current}&size=${pageSize}`,
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
        setListUser(d.data.result);
        setTotal(d.data.meta.totalElement)
        setIsLoading(false);
    }

    const columns: TableProps<IUsers>['columns'] = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record, index) => {
                return (
                    <>{value}</>
                )
            },
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Role',
            dataIndex: 'role',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (value, record, index) => {
                return (
                    <div>
                        <Button
                            color="primary"
                            variant="solid"
                            onClick={() => {
                                setDataUpdate(record);
                                setIsUpdateModalOpen(true);
                            }}
                            className='mr-5'
                        >
                            Edit
                        </Button>

                        <Popconfirm
                            title="Delete the user"
                            description={`Are you sure to delete this user. name = ${record.name}?`}
                            onConfirm={() => handleDeleteUser(record)}
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

    const handleDeleteUser = async (user: IUsers) => {
        const res = await fetch(`http://localhost:8080/api/v1/users/${user._id}`,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
            }
        )

        const d = await res.json();
        console.log('>>>> check res delete: ', d);
        if (d.data) {
            await getData();
            notificationApi.success({
                message: "Xóa user thành công",
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
                <h2 className='text-4xl font-semibold'>Table Users</h2>
                <Button
                    type='primary'
                    icon={<PlusCircleOutlined />}
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    Add New
                </Button>
            </div>

            <Table<IUsers>
                rowKey={"_id"}
                columns={columns}
                dataSource={listUser}
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

            <CreateUserModal
                access_token={access_token}
                getData={getData}
                isCreateModalOpen={isCreateModalOpen}
                setIsCreateModalOpen={setIsCreateModalOpen}
                setIsLoading={setIsLoading}
            />

            <UpdateUserModal
                access_token={access_token}
                getData={getData}
                isUpdateModalOpen={isUpdateModalOpen}
                setIsUpdateModalOpen={setIsUpdateModalOpen}

                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}

                setIsLoading={setIsLoading}
            />
        </div>
    )
}

export default UsersTable;