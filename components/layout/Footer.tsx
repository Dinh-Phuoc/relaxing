"use client";

import React from "react";
import { Film } from "lucide-react";
import {
  FooterRoot,
  FooterInner,
  FooterGrid,
  FooterBrand,
  FooterBrandRow,
  FooterLogoIcon,
  FooterLogoText,
  FooterDescription,
  FooterColumnTitle,
  FooterLink,
  FooterDivider,
  FooterDisclaimer,
  FooterCopyright,
} from "~/styles/components/footer.styles";

export default function Footer() {
  return (
    <FooterRoot>
      <FooterInner>
        <FooterGrid>
          <FooterBrand>
            <FooterBrandRow>
              <FooterLogoIcon>
                <Film size={18} color="white" />
              </FooterLogoIcon>
              <FooterLogoText>Relaxing</FooterLogoText>
            </FooterBrandRow>
            <FooterDescription>
              Nền tảng xem phim trực tuyến HD chất lượng cao. Cập nhật phim mới
              nhất, nhanh nhất.
            </FooterDescription>
          </FooterBrand>
          <div>
            <FooterColumnTitle>Thể loại</FooterColumnTitle>
            {[
              "Hành động",
              "Tình cảm",
              "Hài hước",
              "Kinh dị",
              "Khoa học viễn tưởng",
            ].map((g) => (
              <FooterLink
                key={g}
                href={`/search?genre=${encodeURIComponent(g)}`}
              >
                {g}
              </FooterLink>
            ))}
          </div>
          <div>
            <FooterColumnTitle>Quốc gia</FooterColumnTitle>
            {["Việt Nam", "Hàn Quốc", "Nhật Bản", "Mỹ", "Trung Quốc"].map(
              (c) => (
                <FooterLink
                  key={c}
                  href={`/search?country=${encodeURIComponent(c)}`}
                >
                  {c}
                </FooterLink>
              ),
            )}
          </div>
          <div>
            <FooterColumnTitle>Liên kết</FooterColumnTitle>
            {[
              { label: "Trang chủ", href: "/" },
              { label: "Tìm kiếm", href: "/search" },
              { label: "Đăng nhập", href: "/login" },
            ].map(({ label, href }) => (
              <FooterLink key={href} href={href}>
                {label}
              </FooterLink>
            ))}
          </div>
        </FooterGrid>

        <FooterDivider>
          <FooterDisclaimer>
            ⚠️ <strong>Tuyên bố miễn trách:</strong> CineHub chỉ tổng hợp và
            nhúng liên kết từ các nguồn bên thứ ba. Chúng tôi không lưu trữ bất
            kỳ nội dung video nào trên máy chủ. Mọi nội dung thuộc quyền sở hữu
            của các nhà cung cấp nội dung gốc.
          </FooterDisclaimer>
          <FooterCopyright>
            © 2024 CineHub. Xây dựng với ❤️ cho mục đích học tập.
          </FooterCopyright>
        </FooterDivider>
      </FooterInner>
    </FooterRoot>
  );
}
