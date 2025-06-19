'use client';

import { ReactNode } from 'react';

import Link from 'next/link';

import LanguageToggle from '@/components/shared/LanguageToggle';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowLeft, Shield, Users, Zap } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    footerText: string;
    footerLinkText: string;
    footerLinkHref: string;
}

export default function AuthLayout({
    children,
    title,
    subtitle,
    footerText,
    footerLinkText,
    footerLinkHref
}: AuthLayoutProps) {
    return (
        <div className='grid min-h-screen lg:grid-cols-2'>
            {/* Left side - Form */}
            <div className='flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24'>
                {/* Header */}
                <div className='mb-8 flex items-center justify-between'>
                    <Link
                        href='/'
                        className='text-muted-foreground hover:text-foreground flex items-center space-x-2 text-sm transition-colors'>
                        <ArrowLeft className='h-4 w-4' />
                        <span>Volver al inicio</span>
                    </Link>
                    <div className='flex items-center space-x-2'>
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>
                </div>

                {/* Logo */}
                <div className='mb-8 flex items-center space-x-2'>
                    <div className='bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold'>
                        F
                    </div>
                    <span className='text-2xl font-bold'>FIMA</span>
                    <Badge variant='secondary'>Beta</Badge>
                </div>

                {/* Form Card */}
                <Card className='mx-auto w-full max-w-md lg:mx-0'>
                    <CardHeader className='space-y-4'>
                        <div className='space-y-2'>
                            <CardTitle className='text-2xl font-bold'>{title}</CardTitle>
                            <CardDescription className='text-base'>{subtitle}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>{children}</CardContent>
                </Card>

                {/* Footer */}
                <div className='text-muted-foreground mx-auto mt-8 max-w-md text-center text-sm lg:mx-0'>
                    <p>
                        {footerText}{' '}
                        <Link href={footerLinkHref} className='text-primary font-medium hover:underline'>
                            {footerLinkText}
                        </Link>
                    </p>
                </div>

                {/* Security notice */}
                <div className='mx-auto mt-8 max-w-md lg:mx-0'>
                    <div className='text-muted-foreground flex items-center space-x-2 text-xs'>
                        <Shield className='h-4 w-4' />
                        <span>Tus datos están protegidos con cifrado de nivel bancario</span>
                    </div>
                </div>
            </div>

            {/* Right side - Illustration/Features */}
            <div className='from-primary/5 via-background to-accent/5 relative hidden bg-gradient-to-br lg:block'>
                <div className='relative flex h-full flex-col justify-center p-12'>
                    {/* Background decoration */}
                    <div className='bg-grid-pattern absolute inset-0 opacity-5'></div>
                    <div className='bg-primary/10 absolute top-20 right-20 h-32 w-32 rounded-full blur-xl'></div>
                    <div className='bg-accent/10 absolute bottom-20 left-20 h-40 w-40 rounded-full blur-xl'></div>

                    {/* Content */}
                    <div className='relative z-10 space-y-12'>
                        <div className='space-y-6'>
                            <h2 className='text-foreground text-3xl font-bold'>Gestiona tus finanzas con confianza</h2>
                            <p className='text-muted-foreground text-xl'>
                                Únete a miles de usuarios que ya controlan sus gastos, inversiones y finanzas
                                compartidas en un solo lugar.
                            </p>
                        </div>

                        {/* Features */}
                        <div className='space-y-6'>
                            <div className='flex items-start space-x-4'>
                                <div className='bg-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg'>
                                    <Zap className='text-primary h-5 w-5' />
                                </div>
                                <div>
                                    <h3 className='text-foreground font-semibold'>Importación automática</h3>
                                    <p className='text-muted-foreground text-sm'>
                                        Conecta tus cuentas bancarias y procesa automáticamente tus movimientos.
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start space-x-4'>
                                <div className='bg-accent/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg'>
                                    <Users className='text-accent h-5 w-5' />
                                </div>
                                <div>
                                    <h3 className='text-foreground font-semibold'>Gastos compartidos</h3>
                                    <p className='text-muted-foreground text-sm'>
                                        Gestiona gastos de grupo, viajes y compañeros de piso sin complicaciones.
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start space-x-4'>
                                <div className='bg-secondary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg'>
                                    <Shield className='text-secondary h-5 w-5' />
                                </div>
                                <div>
                                    <h3 className='text-foreground font-semibold'>Seguridad máxima</h3>
                                    <p className='text-muted-foreground text-sm'>
                                        Cifrado de nivel bancario y cumplimiento GDPR para proteger tus datos.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial */}
                        <div className='bg-card space-y-4 rounded-lg border p-6'>
                            <p className='text-muted-foreground text-sm italic'>
                                "FIMA ha cambiado completamente cómo gestiono mis finanzas personales y los gastos
                                compartidos con mis compañeros de piso."
                            </p>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
                                    <span className='text-primary text-xs font-semibold'>MG</span>
                                </div>
                                <div>
                                    <p className='text-sm font-medium'>María García</p>
                                    <p className='text-muted-foreground text-xs'>Diseñadora freelance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
