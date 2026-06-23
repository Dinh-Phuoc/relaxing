import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '~/components/shared/Providers';

export const metadata: Metadata = {
    title: { default: 'CineHub — Xem phim HD Online', template: '%s | CineHub' },
    description: 'Xem phim HD Online miễn phí. Phim mới cập nhật, phim bộ, phim lẻ, anime, phim Hàn, phim Mỹ.',
    keywords: ['xem phim online', 'phim HD', 'phim mới', 'cinehub'],
    openGraph: {
        type: 'website',
        locale: 'vi_VN',
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: 'CineHub',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="vi" className="dark">
            <body className="antialiased" style={{ background: '#0a0a0f', color: '#ffffff' }}>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
