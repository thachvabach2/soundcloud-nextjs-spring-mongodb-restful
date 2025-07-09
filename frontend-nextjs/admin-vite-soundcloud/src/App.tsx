import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import UsersPage from './screens/users.page'
import { CommentOutlined, CustomerServiceOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Link } from "react-router";
import TracksPage from './screens/tracks.page'
import CommentsPage from './screens/comments.page'

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        label: <Link to="/">Home</Link>,
        key: 'home',
        icon: <HomeOutlined />,
    },
    {
        label: <Link to="/users">Manage Users</Link>,
        key: 'users',
        icon: <UserOutlined />,
    },
    {
        label: <Link to="/tracks">Manage Tracks</Link>,
        key: 'tracks',
        icon: <CustomerServiceOutlined />,
    },
    {
        label: <Link to="/comments">Manage Comments</Link>,
        key: 'comments',
        icon: <CommentOutlined />,
    },
];

const Header: React.FC = () => {
    const [current, setCurrent] = useState('home');

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    return (
        <Menu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    );
};

const LayoutAdmin = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

function App() {

    useEffect(() => {
        getData();
    }, [])

    const getData = async () => {

        const res = await fetch('http://localhost:8080/api/v1/auth/login',
            {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify({
                    username: 'admin@gmail.com',
                    password: '123456'
                })
            }
        )

        const d = await res.json();
        if (d.data) {
            localStorage.setItem('access_token', d.data.access_token);
        }
    }


    const AppVite = () => {
        const [count, setCount] = useState(0)

        return (
            <>
                <div className='flex justify-center'>
                    <a href="https://vite.dev" target="_blank">
                        <img src={viteLogo} className="logo" alt="Vite logo" />
                    </a>
                    <a href="https://react.dev" target="_blank">
                        <img src={reactLogo} className="logo react" alt="React logo" />
                    </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                    <button onClick={() => setCount((count) => count + 1)}>
                        count is {count}
                    </button>
                    <p>
                        Edit <code>src/App.tsx</code> and save to test HMR
                    </p>
                </div>
                <p className="read-the-docs">
                    Click on the Vite and React logos to learn more
                </p>
            </>
        )
    }

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LayoutAdmin />} >
                        <Route index element={<AppVite />} />
                        <Route path="users" element={<UsersPage />} />
                        <Route path="/tracks" element={<TracksPage />} />
                        <Route path="/comments" element={<CommentsPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
