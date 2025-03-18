
import { useEffect, useState } from 'react';
import '../../styles/users.css'

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

    console.log('>>>> check List user: ', listUser);
    return (
        <div>
            <h2>Table Users</h2>

            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listUser.map((item: IUsers, index) => {
                            return (
                                <tr key={index}>
                                    <td>{item.email}</td>
                                    <td>{item.name}</td>
                                    <td>{item.role}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default UsersTable;