"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Film, Eye, EyeOff } from "lucide-react";
import { useAuthStore } from "~/stores/auth.store";
import apiClient from "~/lib/axios/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Alert } from "~/components/ui/alert";
import {
  AuthWrapper,
  AuthBrand,
  AuthLogo,
  AuthTitle,
  AuthSubtitle,
  AuthCard,
  AuthForm,
  AuthField,
  PasswordWrapper,
  PasswordToggle,
  AuthFooter,
} from "~/styles/components/auth.styles";

function getSafeRedirect(path: string | null): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  if (path.startsWith("/login")) return "/";
  return path;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", {
        username,
        password,
      });
      if (data.success) {
        setAuth(data.data.user, data.data.accessToken);
        router.push(getSafeRedirect(searchParams.get("redirect")));
      }
    } catch (err: unknown) {
      const msg = (
        err as { response?: { data?: { error?: { message?: string } } } }
      )?.response?.data?.error?.message;
      setError(msg ?? "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthBrand>
        <AuthLogo>
          <Film size={28} color="white" />
        </AuthLogo>
        <AuthTitle>Relaxing</AuthTitle>
        <AuthSubtitle>Đăng nhập để tiếp tục</AuthSubtitle>
      </AuthBrand>

      <AuthCard>
        <AuthForm onSubmit={handleSubmit}>
          <AuthField>
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
            />
          </AuthField>

          <AuthField>
            <Label htmlFor="password">Mật khẩu</Label>
            <PasswordWrapper>
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="pr-11"
              />
              <PasswordToggle type="button" onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </PasswordToggle>
            </PasswordWrapper>
          </AuthField>

          {error && <Alert variant="destructive">{error}</Alert>}

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </AuthForm>

        <AuthFooter>Liên hệ admin để được cấp tài khoản.</AuthFooter>
      </AuthCard>
    </AuthWrapper>
  );
}
