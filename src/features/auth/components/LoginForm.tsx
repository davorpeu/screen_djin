import React from 'react';
import {Alert, Button, Form, Input} from 'antd';
import {LockOutlined, LoginOutlined, UserOutlined} from '@ant-design/icons';
import {LoginCredentials} from '../types';

interface LoginFormProps {
    onSubmit: (values: LoginCredentials) => void;
    loading: boolean;
    error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
    return (
        <Form
            name="login"
            layout="vertical"
            onFinish={onSubmit}
            autoComplete="off"
        >
            {error && (
                <Alert
                    message="Login Failed"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: '24px' }}
                />
            )}

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
        </Form>
    );
};