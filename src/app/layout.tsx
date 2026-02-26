import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OffStump — BMI Calculator + Personalized Diet Chart",
  description:
    "Calculate your BMI, get a personalized diet chart, and download a detailed health report as PDF. Free and private.",
  keywords: [
    "BMI calculator",
    "diet chart",
    "personalized nutrition",
    "health report",
    "OffStump",
  ],
  icons: {
    icon: "/favicon.jpeg",
    apple: "/favicon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* Animated background */}
        <div className="bg-mesh" />
        <div className="grid-overlay" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
