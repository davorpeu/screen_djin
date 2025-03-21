import React from 'react';
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';

export const LoadingPage: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
        }}>
            <Spin
                indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                tip="Loading..."
            />
        </div>
    );
};
