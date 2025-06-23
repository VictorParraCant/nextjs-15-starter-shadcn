import { ReactNode } from 'react';

import { notFound } from 'next/navigation';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const locales = ['en', 'es', 'ca'] as const;

interface LocaleLayoutProps {
    children: ReactNode;
    params: {
        locale: string;
    };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;
    if (!locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}
