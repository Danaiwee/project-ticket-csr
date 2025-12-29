import type { Metadata } from "next";
import { Inter, Kanit, Roboto } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const kanit = Kanit({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TicketSpace - จองสถานที่ออนไลน์ สะดวก รวดเร็ว มั่นใจ",
  description:
    "สัมผัสประสบการณ์ใหม่ในการจองสถานที่ท่องเที่ยวกับ TicketSpace ระบบที่เชื่อมโยงคุณกับสถานที่ต่างๆ พร้อมเช็คที่ว่างแบบเรียลไทม์ จองง่าย ได้ที่แน่นอน หมดกังวลเรื่องการจองซ้ำซ้อน",
  icons: "/icons/logo.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kanit.variable} ${inter.variable} ${roboto.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
