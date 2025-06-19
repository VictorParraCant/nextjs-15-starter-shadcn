import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { ThemeProvider } from 'next-themes';

import '@/app/globals.css';
import AuthProvider from '@/components/auth/AuthProvider';
import ReduxProviders from '@/lib/redux/providers';

import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export const metadata: Metadata = {
    title: {
        default: 'FIMA - Gestor Financiero Personal',
        template: '%s | FIMA'
    },
    description: 'Gestiona tus finanzas personales y colaborativas de forma inteligente con FIMA',
    keywords: ['finanzas', 'gestor financiero', 'gastos compartidos', 'presupuesto', 'inversiones'],
    authors: [{ name: 'FIMA Team' }],
    creator: 'FIMA',
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
        type: 'website',
        locale: 'es_ES',
        url: '/',
        title: 'FIMA - Gestor Financiero Personal',
        description: 'Gestiona tus finanzas personales y colaborativas de forma inteligente',
        siteName: 'FIMA',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'FIMA - Gestor Financiero Personal'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FIMA - Gestor Financiero Personal',
        description: 'Gestiona tus finanzas personales y colaborativas de forma inteligente',
        images: ['/og-image.png'],
        creator: '@fima_app'
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    manifest: '/manifest.json',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png'
    },
    verification: {
        google: process.env.GOOGLE_VERIFICATION
    }
};

interface RootLayoutProps {
    children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
    return (
        <html suppressHydrationWarning lang='es' className='theme-financial'>
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground overscroll-none antialiased`}>
                <ReduxProviders>
                    <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
                        <AuthProvider>
                            {children}
                            <Toaster
                                position='top-right'
                                toastOptions={{
                                    duration: 4000,
                                    style: {
                                        background: 'var(--card)',
                                        color: 'var(--card-foreground)',
                                        border: '1px solid var(--border)'
                                    },
                                    success: {
                                        iconTheme: {
                                            primary: 'var(--success)',
                                            secondary: 'var(--background)'
                                        }
                                    },
                                    error: {
                                        iconTheme: {
                                            primary: 'var(--destructive)',
                                            secondary: 'var(--background)'
                                        }
                                    }
                                }}
                            />
                        </AuthProvider>
                    </ThemeProvider>
                </ReduxProviders>
            </body>
        </html>
    );
};

export default RootLayout;
