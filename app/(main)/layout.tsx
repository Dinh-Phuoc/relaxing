import Header from '~/components/layout/Header';
import Footer from '~/components/layout/Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
                {children}
            </main>
            <Footer />
        </>
    );
}
