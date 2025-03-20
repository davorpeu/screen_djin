// src/routes/NotFoundPage.tsx
import React from 'react';
import { Result, Button } from 'antd';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#f0f2f5'
        }}>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to="/">
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </div>
    );
};