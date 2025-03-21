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

    // State for share modal
    const [shareModalVisible, setShareModalVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    // Get the current URL for sharing
    const shareUrl = window.location.href;

    useEffect(() => {
        if (id) {
            getListDetails(parseInt(id));
        }
    }, [id, getListDetails]);

    // Function to copy URL to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                setCopied(true);
                message.success('URL copied to clipboard!');
                // Reset the copied state after a short delay
                setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
                message.error('Failed to copy URL');
            });
    };

    // Show the share modal
    const showShareModal = () => {
        setShareModalVisible(true);
    };

    // Hide the share modal
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