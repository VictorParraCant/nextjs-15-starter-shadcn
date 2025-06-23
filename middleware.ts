import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    locales: ['es', 'en', 'ca'],
    defaultLocale: 'es'
});

export const config = {
    matcher: ['/', '/(ca|en|es)/:path*', '/((?!api|_next|_vercel|.*\\.).*)']
};
