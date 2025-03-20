// Create a new file at src/components/layout/AppLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import { Navbar } from './NavBar';

const { Content } = Layout;

interface AppLayoutProps {
    children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Navbar />
            <Content style={{ marginTop: 64, padding: '0' }}>
                {children}
            </Content>
        </Layout>
    );
};