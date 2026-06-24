import { Suspense } from 'react';
import Header from '~/components/layout/Header';
import Footer from '~/components/layout/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={<header className="fixed top-0 left-0 right-0 h-16 bg-background z-50" />}>
                <Header />
            </Suspense>
            <main className="pt-16 min-h-screen overflow-x-hidden w-full">{children}</main>
            <Footer />
        </>
    );
}
