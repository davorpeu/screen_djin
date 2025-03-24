import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { message } from 'antd';
import { useLists } from '@/features/lists';
import { useAuth } from "@/features/auth";
import { ListDetailView } from './ListDetailView';

export const ListDetailContainer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { currentList, getListDetails } = useLists();
    const { isAuthenticated } = useAuth();

    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = window.location.href;

    useEffect(() => {
        if (id) {
            getListDetails(parseInt(id));
        }
    }, [id, getListDetails]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                message.success('URL copied to clipboard!');
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
                message.error('Failed to copy URL');
            });
    };

    const showShareModal = () => {
        setShareModalVisible(true);
    };

    const hideShareModal = () => {
        setShareModalVisible(false);
        setCopied(false);
    };

    return (
        <ListDetailView
            list={currentList.data}
            loading={currentList.loading}
            error={currentList.error}
            isAuthenticated={isAuthenticated}
            shareUrl={shareUrl}
            shareModalVisible={shareModalVisible}
            copied={copied}
            onShowShareModal={showShareModal}
            onHideShareModal={hideShareModal}
            onCopyToClipboard={copyToClipboard}
        />
    );
};