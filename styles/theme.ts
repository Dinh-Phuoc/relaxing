export const theme = {
    colors: {
        background: '#0a0a0f',
        surface: '#111118',
        card: '#1a1a2e',
        accentRed: '#e50914',
        accentRedDark: '#b20710',
        accentGold: '#f5c518',
        textPrimary: '#ffffff',
        textSecondary: '#a0a0b0',
        textMuted: '#606070',
        textSoft: '#c0c0d0',
        border: 'rgba(255,255,255,0.08)',
        borderLight: 'rgba(255,255,255,0.1)',
        borderStrong: 'rgba(255,255,255,0.12)',
        error: '#e57080',
        errorBg: 'rgba(229,9,20,0.1)',
        errorBorder: 'rgba(229,9,20,0.3)',
        overlay: 'rgba(0,0,0,0.4)',
        inputBg: 'rgba(255,255,255,0.06)',
    },
    radii: {
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
        full: '9999px',
    },
    spacing: {
        headerHeight: '64px',
        pageMaxWidth: '1400px',
    },
    fonts: {
        sans: "'Inter', sans-serif",
        display: "'Bebas Neue', sans-serif",
    },
    shadows: {
        cardHover: '0 12px 24px rgba(0,0,0,0.4)',
        dropdown: '0 20px 40px rgba(0,0,0,0.6)',
        posterHover: '0 8px 24px rgba(0,0,0,0.6)',
    },
    gradients: {
        accent: 'linear-gradient(135deg, #e50914, #b20710)',
        headerScrolled: 'rgba(10, 10, 15, 0.97)',
        headerTop: 'linear-gradient(to bottom, rgba(10, 10, 15, 0.85), transparent)',
        posterBottom: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
    },
} as const;

export type AppTheme = typeof theme;
