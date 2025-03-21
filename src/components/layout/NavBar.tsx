import React from 'react';
import {Button, Layout} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {LogoutOutlined} from '@ant-design/icons';
import {useAuth} from '@/features/auth';

const { Header } = Layout;

export const Navbar: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const handleLogout = () => {
        logout().then(() => {
            navigate('/login');
        });
    };

    return (
        <Header style={{
            position: 'fixed',
            zIndex: 1,
            width: '100%',
            padding: '0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div className="logo" style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                <Link to="/" style={{ color: 'white' }}>
                    Screen Djin
                </Link>
            </div>

            {isAuthenticated ? (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        type="link"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: 'white' }}
                    >
                        Logout
                    </Button>
                </div>
            ) : (
                <Button type="primary" onClick={() => navigate('/login')}>
                    Login
                </Button>
            )}
        </Header>
    );
};