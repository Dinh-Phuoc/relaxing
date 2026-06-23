import React from 'react';
import Link from 'next/link';
import { Film } from 'lucide-react';

export default function Footer() {
    return (
        <footer style={{ background: '#0d0d15', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '80px', padding: '48px 0 24px' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', marginBottom: '40px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'linear-gradient(135deg, #e50914, #b20710)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Film size={18} color="white" />
                            </div>
                            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '20px', color: 'white', letterSpacing: '2px' }}>CINEHUB</span>
                        </div>
                        <p style={{ color: '#606070', fontSize: '13px', lineHeight: '1.6' }}>
                            Nền tảng xem phim trực tuyến HD chất lượng cao. Cập nhật phim mới nhất, nhanh nhất.
                        </p>
                    </div>
                    <div>
                        <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Thể loại</h4>
                        {['Hành động', 'Tình cảm', 'Hài hước', 'Kinh dị', 'Khoa học viễn tưởng'].map((g) => (
                            <Link key={g} href={`/search?genre=${encodeURIComponent(g)}`}
                                style={{ display: 'block', color: '#606070', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#a0a0b0')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#606070')}
                            >{g}</Link>
                        ))}
                    </div>
                    <div>
                        <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Quốc gia</h4>
                        {['Việt Nam', 'Hàn Quốc', 'Nhật Bản', 'Mỹ', 'Trung Quốc'].map((c) => (
                            <Link key={c} href={`/search?country=${encodeURIComponent(c)}`}
                                style={{ display: 'block', color: '#606070', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#a0a0b0')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#606070')}
                            >{c}</Link>
                        ))}
                    </div>
                    <div>
                        <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Liên kết</h4>
                        {[
                            { label: 'Trang chủ', href: '/' },
                            { label: 'Tìm kiếm', href: '/search' },
                            { label: 'Đăng nhập', href: '/login' },
                            { label: 'Đăng ký', href: '/register' },
                        ].map(({ label, href }) => (
                            <Link key={href} href={href}
                                style={{ display: 'block', color: '#606070', textDecoration: 'none', fontSize: '13px', marginBottom: '8px', transition: 'color 0.2s' }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = '#a0a0b0')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = '#606070')}
                            >{label}</Link>
                        ))}
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px' }}>
                    <p style={{ color: '#3a3a4a', fontSize: '12px', textAlign: 'center', lineHeight: '1.6' }}>
                        ⚠️ <strong style={{ color: '#4a4a5a' }}>Tuyên bố miễn trách:</strong> CineHub chỉ tổng hợp và nhúng liên kết từ các nguồn bên thứ ba. Chúng tôi không lưu trữ bất kỳ nội dung video nào trên máy chủ. Mọi nội dung thuộc quyền sở hữu của các nhà cung cấp nội dung gốc.
                    </p>
                    <p style={{ color: '#3a3a4a', fontSize: '12px', textAlign: 'center', marginTop: '8px' }}>
                        © 2024 CineHub. Xây dựng với ❤️ cho mục đích học tập.
                    </p>
                </div>
            </div>
        </footer>
    );
}
