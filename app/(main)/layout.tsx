import { Suspense } from 'react';
import Header from '~/components/layout/Header';
import Footer from '~/components/layout/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={<header style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '64px', background: '#0a0a0f', zIndex: 50 }} />}>
                <Header />
            </Suspense>
            <main style={{ paddingTop: '64px', minHeight: '100vh', overflowX: 'hidden', width: '100%' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
