import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './features/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#0a0a0f',
                surface: '#111118',
                card: '#1a1a2e',
                border: 'rgba(255,255,255,0.08)',
                accent: {
                    red: '#e50914',
                    gold: '#f5c518',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a0a0b0',
                    muted: '#606070',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Bebas Neue', 'Impact', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                shimmer: 'shimmer 1.5s infinite',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
                shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
            },
        },
    },
    plugins: [],
};
export default config;
