import React from "react";
import {Card, Layout, Typography} from "antd";
import {LoginForm} from "@/features/auth/components/LoginForm";
import {LoginCredentials} from "@/features/auth";
const { Title, Text } = Typography;
const { Content } = Layout;
interface LoginPage {
    loading: boolean,
    error: string | null,
    login: (values: LoginCredentials) => void;
}

export const LoginPageView: React.FC<LoginPage> = ({
                                                      loading,
                                                        error,
                                                        login
                                                   }) => {

    return (
        <Layout>
            <Content style={{
                padding: '50px 0',
                minHeight: '100vh',
                background: 'linear-gradient(to right, #141e30, #243b55)'
            }}>
                <div style={{maxWidth: '400px', margin: '0 auto', padding: '0 16px'}}>
                    <Card
                        style={{
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                            borderRadius: '8px'
                        }}
                    >
                        <div style={{textAlign: 'center', marginBottom: '24px'}}>
                            <Title level={2} style={{marginBottom: '8px'}}>Welcome Back</Title>
                            <Text type="secondary">Sign in to your TMDB account</Text>
                        </div>

                        <LoginForm
                            onSubmit={login}
                            loading={loading}
                            error={error}
                        />

                        <div style={{textAlign: 'center'}}>
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
