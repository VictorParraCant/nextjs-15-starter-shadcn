import { Metadata } from 'next';

import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

import { useTranslations } from 'next-intl';

export const metadata: Metadata = {
    title: 'Iniciar Sesión',
    description: 'Inicia sesión en tu cuenta de FIMA'
};

export default function LoginPage() {
    const t = useTranslations('auth.login');

    return (
        <AuthLayout
            title={t('title')}
            subtitle={t('subtitle')}
            footerText={t('noAccount')}
            footerLinkText={t('createAccount')}
            footerLinkHref='/register'>
            <LoginForm />
        </AuthLayout>
    );
}
