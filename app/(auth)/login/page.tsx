import { Suspense } from 'react';
import LoginClient from '~/features/auth/components/LoginClient';

export const metadata = { title: 'Đăng nhập | CineHub' };

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginClient />
        </Suspense>
    );
}
