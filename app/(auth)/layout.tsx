'use client';

import { AuthLayoutWrapper } from '~/styles/components/auth.styles';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
