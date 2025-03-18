
import { useEffect, useState } from 'react';
// import '../../styles/users.css'
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface IUsers {
    email: string;
    name: string;
    role: string;
}

const UsersTable = () => {
    const [listUser, setListUser] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const access_token = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJleHAiOjE3NTA4NDk1NDMsImF1dGgiOiJST0xFX1VTRVIiLCJpYXQiOjE3NDIyMDk1NDN9.jPO75P0zy05boARYB8Jb99y-K6pXaNyc1ym2bAA11eHJ02es3esg5ET3Bw8a-_obE3nrsinjQ0FhwVzBUV2WSg';

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
    }

    //
    interface DataType {
        email: string;
        name: number;
        role: string;
    }

    const columns: TableProps<DataType>['columns'] = [
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

    console.log('>>>> check List user: ', listUser);
    return (
        <div>
            <h2 className='text-4xl font-semibold'>Table Users</h2>

            <Table<DataType> columns={columns} dataSource={listUser} rowKey={"_id"} />
        </div>
    )
}

export default UsersTable;