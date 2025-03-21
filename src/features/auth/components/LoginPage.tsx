import React, {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Card, Layout, Typography} from 'antd';
import {LoginForm} from './LoginForm';
import {useAuth} from '@/features/auth';

const { Title, Text } = Typography;
const { Content } = Layout;

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, loading, error, isAuthenticated, clearError } = useAuth();

    const from = (location.state as { from?: string })?.from || '/';

    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    useEffect(() => {
        return () => {
            clearError();
        };
    }, [clearError]);

    return (
        <Layout>
            <Content style={{
                padding: '50px 0',
                minHeight: '100vh',
                background: 'linear-gradient(to right, #141e30, #243b55)'
            }}>
                <div style={{ maxWidth: '400px', margin: '0 auto', padding: '0 16px' }}>
                    <Card
                        style={{
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <Title level={2} style={{ marginBottom: '8px' }}>Welcome Back</Title>
                            <Text type="secondary">Sign in to your TMDB account</Text>
                        </div>

                        <LoginForm
                            onSubmit={login}
                            loading={loading}
                            error={error}
                        />

                        <div style={{ textAlign: 'center' }}>
                            <Text type="secondary">
                                Don't have a TMDB account?{' '}
                                <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener noreferrer">
                                    Create an account
                                </a>
                            </Text>
                        </div>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};
