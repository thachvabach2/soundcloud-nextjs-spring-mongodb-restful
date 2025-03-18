import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import UsersPage from './screens/users.page'
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { Link } from "react-router";

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
    const [count, setCount] = useState(0)

    const AppVite = () => {
        return (
            <>
                <div>
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
                    </Route>
                    <Route path="/tracks" element={<div>Manage Tracks</div>} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
