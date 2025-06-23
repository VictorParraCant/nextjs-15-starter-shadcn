import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/app/[locale]/i18n.ts');

const isUsingTurbopack = process.env.NEXT_USE_TURBOPACK === 'true';
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: !isUsingTurbopack && process.env.BUNDLE_ANALYZER_ENABLED === 'true'
});

const nextConfig: NextConfig = {
    output: 'standalone',
    outputFileTracingIncludes: {
        '/*': ['./registry/**/*']
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'firebasestorage.googleapis.com' }
        ]
    },
    serverExternalPackages: ['pdfjs-dist'],
    turbopack: {}
};

export default withBundleAnalyzer(withNextIntl(nextConfig));
