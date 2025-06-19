// src/app/[locale]/i18n.ts
import { notFound } from 'next/navigation';

import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'es', 'ca'] as const;
export const defaultLocale = 'es' as const;

export default getRequestConfig(async ({ locale }) => {
    // Validate that the incoming `locale` parameter is valid
    if (!locales.includes(locale as any)) notFound();

    return {
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
