
import { useEffect, useState } from 'react';
// import '../../styles/users.css'
import { Button, Table, Modal, Input, notification, message, Space } from 'antd';
import type { TableProps } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

interface IUsers {
    _id: string;
    email: string;
    name: string;
    role: string;
}

const UsersTable = () => {

    const [notificationApi, contextHolder] = notification.useNotification();

    const [listUser, setListUser] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState("");

    const [isLoading, setIsLoading] = useState(false);

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
        setListUser(d.data.result);
        setIsLoading(false);
    }

    const columns: TableProps<IUsers>['columns'] = [
        {
            title: 'Email',
            dataIndex: 'email',
            render: (value, record, index) => {
                return (
                    <>{record.email}</>
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
    ]

    const handleOk = async () => {
        setIsLoading(true);
        const data = {
            name, email, password, age, gender, role, address
        }

        const res = await fetch('http://localhost:8080/api/v1/users',
            {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({ ...data })
            }
        )

        const d = await res.json();
        if (d.data) {
            await getData();
            notificationApi.success({
                message: "Tạo mới user thành công",
            })
            handleCloseCreateModal();
        } else {
            notificationApi.error({
                message: "Có lỗi xảy ra",
                description: JSON.stringify(d.message),
            })
        }

        setIsLoading(false);
    };

    const handleCloseCreateModal = () => {
        setIsModalOpen(false);
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        setGender("");
        setAddress("");
        setRole("");
    }

    return (
        <div>
            {contextHolder}
            <div className='flex justify-between align-middle my-7'>
                <h2 className='text-4xl font-semibold'>Table Users</h2>
                <Button
                    type='primary'
                    icon={<PlusCircleOutlined />}
                    onClick={() => setIsModalOpen(true)}
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

            <Modal
                title="Add new user"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => handleCloseCreateModal()}
                maskClosable={false}
            >
                <div>
                    <label>Name: </label>
                    <Input
                        value={name}
                        onChange={(event) => setName(event.target.value)} />
                </div>
                <div>
                    <label>Email: </label>
                    <Input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div>
                    <label>Password: </label>
                    <Input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div>
                    <label>Age: </label>
                    <Input
                        value={age}
                        onChange={(event) => setAge(event.target.value)} />
                </div>
                <div>
                    <label>Gender: </label>
                    <Input
                        value={gender}
                        onChange={(event) => setGender(event.target.value)} />
                </div>
                <div>
                    <label>Address: </label>
                    <Input
                        value={address}
                        onChange={(event) => setAddress(event.target.value)} />
                </div>
                <div>
                    <label>Role: </label>
                    <Input
                        value={role}
                        onChange={(event) => setRole(event.target.value)} />
                </div>
            </Modal>
        </div>
    )
}

export default UsersTable;