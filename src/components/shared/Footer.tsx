'use client';

import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    const companyLinks = [
        { href: '/about', label: t('about') },
        { href: '/careers', label: t('careers') },
        { href: '/blog', label: t('blog') }
    ];

    const productLinks = [
        { href: '/features', label: t('features') },
        { href: '/pricing', label: t('pricing') },
        { href: '/security', label: t('security') }
    ];

    const supportLinks = [
        { href: '/help', label: t('help') },
        { href: '/contact', label: t('contact') },
        { href: '/status', label: t('status') }
    ];

    const legalLinks = [
        { href: '/legal/privacy', label: t('privacy') },
        { href: '/legal/terms', label: t('terms') },
        { href: '/legal/cookies', label: t('cookies') }
    ];

    const socialLinks = [
        { href: 'https://github.com/fima-app', icon: Github, label: 'GitHub' },
        { href: 'https://twitter.com/fima_app', icon: Twitter, label: 'Twitter' },
        { href: 'https://linkedin.com/company/fima-app', icon: Linkedin, label: 'LinkedIn' },
        { href: 'mailto:hola@fima.app', icon: Mail, label: 'Email' }
    ];

    return (
        <footer className='bg-muted/30 border-t'>
            <div className='container mx-auto px-4 py-12'>
                <div className='grid gap-8 lg:grid-cols-5'>
                    {/* Brand */}
                    <div className='lg:col-span-1'>
                        <div className='space-y-4'>
                            <div className='flex items-center space-x-2'>
                                <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg font-bold'>
                                    F
                                </div>
                                <span className='text-xl font-bold'>FIMA</span>
                                <Badge variant='secondary'>Beta</Badge>
                            </div>
                            <p className='text-muted-foreground max-w-xs text-sm'>
                                Gestiona tus finanzas personales y colaborativas de forma inteligente.
                            </p>
                            <div className='flex space-x-4'>
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        className='text-muted-foreground hover:text-foreground transition-colors'
                                        target='_blank'
                                        rel='noopener noreferrer'>
                                        <social.icon className='h-5 w-5' />
                                        <span className='sr-only'>{social.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className='mb-4 text-sm font-semibold'>{t('company')}</h3>
                        <ul className='space-y-3'>
                            {companyLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-muted-foreground hover:text-foreground text-sm transition-colors'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className='mb-4 text-sm font-semibold'>{t('product')}</h3>
                        <ul className='space-y-3'>
                            {productLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-muted-foreground hover:text-foreground text-sm transition-colors'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className='mb-4 text-sm font-semibold'>{t('support')}</h3>
                        <ul className='space-y-3'>
                            {supportLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-muted-foreground hover:text-foreground text-sm transition-colors'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className='mb-4 text-sm font-semibold'>{t('legal')}</h3>
                        <ul className='space-y-3'>
                            {legalLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className='text-muted-foreground hover:text-foreground text-sm transition-colors'>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className='my-8' />

                {/* Bottom */}
                <div className='flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0'>
                    <div className='text-muted-foreground flex items-center space-x-4 text-sm'>
                        <p>{t('rights')}</p>
                    </div>

                    <div className='text-muted-foreground flex items-center space-x-4 text-sm'>
                        <span>🔒 Datos protegidos</span>
                        <span>•</span>
                        <span>🇪🇺 GDPR Compliant</span>
                        <span>•</span>
                        <span>🏦 Nivel bancario</span>
                    </div>
                </div>

                {/* Development notice */}
                <div className='bg-primary/5 border-primary/10 mt-6 rounded-lg border p-4'>
                    <div className='flex items-center justify-center space-x-2 text-sm'>
                        <Badge variant='outline' className='bg-primary/10 text-primary border-primary/20'>
                            Beta
                        </Badge>
                        <span className='text-muted-foreground'>
                            FIMA está en desarrollo activo. Algunas características pueden cambiar.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
