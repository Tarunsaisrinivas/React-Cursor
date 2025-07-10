// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Head from "next/head";
import Script from "next/script";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "React Cursor",
    description:
        "A collection of modern cursor components with smooth animations—easy to plug, fun to play.",
    icons: {
        icon: "/favicon.ico",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4177154308183684"
                    strategy="afterInteractive"
                    crossOrigin="anonymous"
                />

                {/* ✅ PWA Meta & Icons */}
                <meta name="application-name" content="React Cursor" />
                <meta
                    name="google-adsense-account"
                    content="ca-pub-4177154308183684"
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="React Cursor"
                />
                <meta
                    name="description"
                    content="Best PWA Cursor Collection App"
                />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta
                    name="msapplication-config"
                    content="/browserconfig.xml"
                />
                <meta name="msapplication-TileColor" content="#2B5797" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#000000" />

                <link rel="shortcut icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
                />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:url" content="https://reactcursor.tech" />
                <meta name="twitter:title" content="React Cursor" />
                <meta
                    name="twitter:description"
                    content="Best PWA Cursor Collection App"
                />
                <meta
                    name="twitter:image"
                    content="https://reactcursor.tech/android-chrome-192x192.png"
                />
                <meta name="twitter:creator" content="@Tarunsaisrinivas" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="React Cursor" />
                <meta
                    property="og:description"
                    content="Best PWA Cursor Collection App"
                />
                <meta property="og:site_name" content="React Cursor" />
                <meta property="og:url" content="https://reactcursor.tech" />
                <meta
                    property="og:image"
                    content="https://reactcursor.tech/apple-touch-icon.png"
                />

                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
                />
                <link
                    rel="icon"
                    type="image/png"
                    href="/favicon-96x96.png"
                    sizes="96x96"
                />
                <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
                <link rel="shortcut icon" href="/favicon.ico" />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
            </head>

            <body
                suppressHydrationWarning
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
