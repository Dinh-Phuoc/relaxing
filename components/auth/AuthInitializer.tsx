'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';
import apiClient, { setAccessToken } from '~/lib/axios/client';
import { useAuthStore } from '~/stores/auth.store';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? '';
const COOKIE_PROBE_KEY = 'cinehub-cookie-probed';

/** Gọi auth endpoint trực tiếp — không qua interceptor tránh vòng lặp refresh */
async function postAuth(path: string) {
    return axios.post(`${BASE_URL}/api${path}`, {}, { withCredentials: true });
}

/** Đồng bộ session khi đã từng đăng nhập (có token hoặc flag trong sessionStorage) */
export default function AuthInitializer() {
    const synced = useRef(false);

    useEffect(() => {
        if (synced.current) return;
        synced.current = true;

        const syncUser = async () => {
            const { accessToken, isAuthenticated, setAuth, clearAuth } = useAuthStore.getState();

            const tryRefreshAndRestore = async (): Promise<boolean> => {
                try {
                    const { data } = await postAuth('/auth/refresh');
                    if (data.success && data.data?.accessToken) {
                        const newToken = data.data.accessToken as string;
                        setAccessToken(newToken);

                        const meRes = await apiClient.get('/auth/me');
                        if (meRes.data.success) {
                            setAuth(meRes.data.data, newToken);
                            return true;
                        }
                    }
                } catch (err: unknown) {
                    const code = (err as { response?: { data?: { error?: { code?: string } } } })
                        ?.response?.data?.error?.code;

                    if (code === 'INVALID_REFRESH_TOKEN') {
                        clearAuth();
                        try {
                            await postAuth('/auth/logout');
                        } catch {
                            // ignore
                        }
                    }
                }
                return false;
            };

            if (accessToken) {
                setAccessToken(accessToken);
                try {
                    const { data } = await apiClient.get('/auth/me');
                    if (data.success) {
                        setAuth(data.data, accessToken);
                        return;
                    }
                } catch {
                    // Token hết hạn — thử refresh
                }

                await tryRefreshAndRestore();
                return;
            }

            if (isAuthenticated) {
                await tryRefreshAndRestore();
                return;
            }

            // Cookie còn nhưng sessionStorage trống — thử 1 lần mỗi tab
            if (sessionStorage.getItem(COOKIE_PROBE_KEY)) return;
            sessionStorage.setItem(COOKIE_PROBE_KEY, '1');
            await tryRefreshAndRestore();
        };

        syncUser();
    }, []);

    return null;
}
