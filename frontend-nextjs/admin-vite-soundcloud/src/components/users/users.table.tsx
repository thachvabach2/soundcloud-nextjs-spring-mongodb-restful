
import { useEffect, useState } from 'react';
// import '../../styles/users.css'
import { PlusCircleOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Button, notification, Table } from 'antd';
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

    const access_token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJleHAiOjE3NTA4NDk1NDMsImF1dGgiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDIyMDk1NDN9.jPO75P0zy05boARYB8Jb99y-K6pXaNyc1ym2bAA11eHJ02es3esg5ET3Bw8a-_obE3nrsinjQ0FhwVzBUV2WSg';

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        setIsLoading(true);

        const res = await fetch('http://localhost:8080/api/v1/users',
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
                        <button
                            onClick={() => {
                                setDataUpdate(record);
                                setIsUpdateModalOpen(true);
                            }}
                        >
                            Edit
                        </button>
                    </div>
                )
            },
        },
    ]

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
                columns={columns}
                dataSource={listUser}
                rowKey={"_id"}
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