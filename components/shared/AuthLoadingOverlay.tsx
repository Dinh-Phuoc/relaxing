'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    AuthLoadingOverlayCard,
    AuthLoadingOverlayMessage,
    AuthLoadingOverlayRoot,
    LoadingSpinner,
} from '~/styles/components/layout.styles';

interface AuthLoadingOverlayProps {
    message: string;
}

export function AuthLoadingOverlay({ message }: AuthLoadingOverlayProps) {
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    return createPortal(
        <AuthLoadingOverlayRoot role="alertdialog" aria-modal="true" aria-busy="true" aria-label={message}>
            <AuthLoadingOverlayCard>
                <LoadingSpinner $size={40} />
                <AuthLoadingOverlayMessage>{message}</AuthLoadingOverlayMessage>
            </AuthLoadingOverlayCard>
        </AuthLoadingOverlayRoot>,
        document.body,
    );
}
