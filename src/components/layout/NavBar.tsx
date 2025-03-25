import React from 'react';
import { Button, Layout, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/features/auth';
import { ToastContainer} from "react-toastify";

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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 24px',
            zIndex: 1,
            width: '100%',
            backgroundColor: '#001529'
        }}>
            <div className="logo" style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                whiteSpace: 'nowrap', // Prevent text wrapping
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                <Link to="/" style={{ color: 'white' }}>
                    Screen Djin
                </Link>
            </div>

            <Space>
                {isAuthenticated ? (
                    <Button
                        type="link"
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        style={{ color: 'white' }}
                    >
                        Logout
                    </Button>
                ) : (
                    <Button
                        type="primary"
                        onClick={() => navigate('/login')}
                        style={{ minWidth: '80px' }} // Ensure minimum width
                    >
                        Login
                    </Button>
                )}
                <ToastContainer />

            </Space>

        </Header>

    );
};