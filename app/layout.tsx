import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AndcoolSystems",
    icons: {
        icon: '/static/andcool.jpg',
        shortcut: '/static/andcool.jpg',
        apple: '/static/andcool.jpg'
    },
    openGraph: {
        title: 'AndcoolSystems',
        description: 'Человек, программист, электронщик',
        url: 'https://andcool.ru',
        siteName: 'andcool.ru',
        images: 'https://andcool.ru/static/andcool.jpg'
    },
    twitter: {
        card: 'summary'
    },
    other: {
        'theme-color': '#0b5000',
        'darkreader-lock': 'darkreader-lock'
    }
};

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ru">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
