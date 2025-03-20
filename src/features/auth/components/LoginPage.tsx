import React, {  useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert, Layout } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { login, clearAuthError } from '../../../store/slices/authSlice';

const { Title, Text } = Typography;
const { Content } = Layout;

interface LoginFormValues {
    username: string;
    password: string;
}

export const LoginPage: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    // Get from location state if available, otherwise default to '/'
    const from = (location.state as { from?: string })?.from || '/';

    const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);

    // Effect to redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, from]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearAuthError());
        };
    }, [dispatch]);

    const onFinish = (values: LoginFormValues) => {
        dispatch(login(values));
    };

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

                        {error && (
                            <Alert
                                message="Login Failed"
                                description={error}
                                type="error"
                                showIcon
                                style={{ marginBottom: '24px' }}
                            />
                        )}

                        <Form
                            name="login"
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="TMDB Username"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Password"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<LoginOutlined />}
                                    loading={loading}
                                    size="large"
                                    block
                                >
                                    Sign In
                                </Button>
                            </Form.Item>

                            <div style={{ textAlign: 'center' }}>
                                <Text type="secondary">
                                    Don't have a TMDB account?{' '}
                                    <a href="https://www.themoviedb.org/signup" target="_blank" rel="noopener noreferrer">
                                        Create an account
                                    </a>
                                </Text>
                            </div>
                        </Form>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};