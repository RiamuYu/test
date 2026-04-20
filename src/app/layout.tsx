import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import "./globals.css";

const vnDisplay = Nunito({
  variable: "--font-vn-display",
  subsets: ["latin"],
});

const vnBody = Nunito_Sans({
  variable: "--font-vn-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Your Body, Your Story",
  description: "Interactive story giáo dục sinh sản: lựa chọn và hậu quả an toàn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${vnDisplay.variable} ${vnBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
