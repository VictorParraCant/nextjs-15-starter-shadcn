import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/components/shared/Footer';
import Navigation from '@/components/shared/Navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ArrowRight, BarChart3, CheckCircle, Globe, Shield, Smartphone, Star, Users, Wallet, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function HomePage() {
    const t = useTranslations();

    const features = [
        {
            icon: Wallet,
            title: t('home.features.personal.title'),
            description: t('home.features.personal.description')
        },
        {
            icon: Users,
            title: t('home.features.collaborative.title'),
            description: t('home.features.collaborative.description')
        },
        {
            icon: BarChart3,
            title: t('home.features.analytics.title'),
            description: t('home.features.analytics.description')
        },
        {
            icon: Shield,
            title: t('home.features.security.title'),
            description: t('home.features.security.description')
        }
    ];

    const testimonials = [
        {
            name: t('home.testimonials.user1.name'),
            role: t('home.testimonials.user1.role'),
            text: t('home.testimonials.user1.text'),
            rating: 5,
            avatar: '/avatars/user1.jpg'
        },
        {
            name: t('home.testimonials.user2.name'),
            role: t('home.testimonials.user2.role'),
            text: t('home.testimonials.user2.text'),
            rating: 5,
            avatar: '/avatars/user2.jpg'
        }
    ];

    const freePlanFeatures = ['Hasta 3 carteras', '100 transacciones/mes', 'Informes básicos', '1 grupo compartido'];

    const proPlanFeatures = [
        'Carteras ilimitadas',
        'Transacciones ilimitadas',
        'Informes avanzados',
        'Grupos ilimitados',
        'Conectores bancarios',
        'Soporte prioritario'
    ];

    return (
        <div className='bg-background min-h-screen'>
            <Navigation />

            {/* Hero Section */}
            <section className='from-primary/5 via-background to-accent/5 relative overflow-hidden bg-gradient-to-br py-24 lg:py-32'>
                <div className='container mx-auto px-4'>
                    <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-20'>
                        <div className='space-y-8'>
                            <div className='space-y-4'>
                                <Badge variant='outline' className='w-fit'>
                                    <Zap className='mr-2 h-3 w-3' />
                                    Nuevo: Conectores bancarios automáticos
                                </Badge>
                                <h1 className='from-primary to-accent bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-6xl'>
                                    {t('home.hero.title')}
                                </h1>
                                <p className='text-muted-foreground max-w-lg text-xl'>{t('home.hero.subtitle')}</p>
                            </div>

                            <div className='flex flex-col gap-4 sm:flex-row'>
                                <Button asChild size='lg' className='px-8 text-lg'>
                                    <Link href='/register'>
                                        {t('home.hero.cta')}
                                        <ArrowRight className='ml-2 h-5 w-5' />
                                    </Link>
                                </Button>
                                <Button variant='outline' size='lg' className='px-8 text-lg'>
                                    {t('home.hero.watchDemo')}
                                </Button>
                            </div>

                            <div className='text-muted-foreground flex items-center gap-6 text-sm'>
                                <div className='flex items-center gap-2'>
                                    <CheckCircle className='text-success h-4 w-4' />
                                    Gratis durante 30 días
                                </div>
                                <div className='flex items-center gap-2'>
                                    <CheckCircle className='text-success h-4 w-4' />
                                    Sin tarjeta de crédito
                                </div>
                            </div>
                        </div>

                        <div className='relative'>
                            <div className='bg-card relative z-10 rounded-2xl border p-8 shadow-2xl'>
                                <div className='space-y-6'>
                                    <div className='flex items-center justify-between'>
                                        <h3 className='font-semibold'>Resumen Financiero</h3>
                                        <Badge variant='secondary'>Diciembre 2024</Badge>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='space-y-2'>
                                            <p className='text-muted-foreground text-sm'>Ingresos</p>
                                            <p className='text-income text-2xl font-bold'>+3.450€</p>
                                        </div>
                                        <div className='space-y-2'>
                                            <p className='text-muted-foreground text-sm'>Gastos</p>
                                            <p className='text-expense text-2xl font-bold'>-2.180€</p>
                                        </div>
                                    </div>

                                    <div className='bg-muted h-2 overflow-hidden rounded-full'>
                                        <div className='from-income to-accent h-full w-3/5 rounded-full bg-gradient-to-r'></div>
                                    </div>

                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-between text-sm'>
                                            <span>🏠 Vivienda</span>
                                            <span className='font-medium'>850€</span>
                                        </div>
                                        <div className='flex items-center justify-between text-sm'>
                                            <span>🍕 Alimentación</span>
                                            <span className='font-medium'>420€</span>
                                        </div>
                                        <div className='flex items-center justify-between text-sm'>
                                            <span>🚗 Transporte</span>
                                            <span className='font-medium'>280€</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating elements */}
                            <div className='bg-primary/10 absolute -top-4 -right-4 h-20 w-20 rounded-full blur-xl'></div>
                            <div className='bg-accent/10 absolute -bottom-4 -left-4 h-32 w-32 rounded-full blur-xl'></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className='bg-muted/30 py-24'>
                <div className='container mx-auto px-4'>
                    <div className='mb-16 space-y-4 text-center'>
                        <h2 className='text-3xl font-bold sm:text-4xl'>{t('home.features.title')}</h2>
                        <p className='text-muted-foreground mx-auto max-w-2xl text-xl'>
                            Todas las herramientas que necesitas para tomar control de tus finanzas
                        </p>
                    </div>

                    <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
                        {features.map((feature, index) => (
                            <Card key={index} className='group relative transition-all duration-300 hover:shadow-lg'>
                                <CardHeader className='space-y-4'>
                                    <div className='bg-primary/10 group-hover:bg-primary/20 flex h-12 w-12 items-center justify-center rounded-lg transition-colors'>
                                        <feature.icon className='text-primary h-6 w-6' />
                                    </div>
                                    <CardTitle className='text-xl'>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className='text-base'>{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className='py-24'>
                <div className='container mx-auto px-4'>
                    <div className='mb-16 space-y-4 text-center'>
                        <h2 className='text-3xl font-bold sm:text-4xl'>{t('home.testimonials.title')}</h2>
                        <p className='text-muted-foreground text-xl'>Más de 10,000 usuarios confían en FIMA</p>
                    </div>

                    <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-2'>
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className='border-2'>
                                <CardContent className='p-8'>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-1'>
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className='fill-primary text-primary h-5 w-5' />
                                            ))}
                                        </div>
                                        <p className='text-lg italic'>"{testimonial.text}"</p>
                                        <div className='flex items-center gap-3'>
                                            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
                                                <span className='text-primary font-semibold'>
                                                    {testimonial.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <p className='font-semibold'>{testimonial.name}</p>
                                                <p className='text-muted-foreground text-sm'>{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className='bg-muted/30 py-24'>
                <div className='container mx-auto px-4'>
                    <div className='mb-16 space-y-4 text-center'>
                        <h2 className='text-3xl font-bold sm:text-4xl'>{t('home.pricing.title')}</h2>
                        <p className='text-muted-foreground text-xl'>Comienza gratis, crece cuando necesites más</p>
                    </div>

                    <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-2'>
                        {/* Free Plan */}
                        <Card className='relative'>
                            <CardHeader className='space-y-4 text-center'>
                                <CardTitle className='text-2xl'>Gratis</CardTitle>
                                <div className='space-y-2'>
                                    <p className='text-4xl font-bold'>0€</p>
                                    <p className='text-muted-foreground'>por mes</p>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <ul className='space-y-3'>
                                    {freePlanFeatures.map((feature, index) => (
                                        <li key={index} className='flex items-center gap-3'>
                                            <CheckCircle className='text-success h-5 w-5' />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className='w-full' variant='outline' asChild>
                                    <Link href='/register'>Comenzar Gratis</Link>
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Pro Plan */}
                        <Card className='border-primary relative shadow-lg'>
                            <div className='absolute -top-3 left-1/2 -translate-x-1/2 transform'>
                                <Badge className='bg-primary text-primary-foreground'>Más Popular</Badge>
                            </div>
                            <CardHeader className='space-y-4 text-center'>
                                <CardTitle className='text-2xl'>Pro</CardTitle>
                                <div className='space-y-2'>
                                    <p className='text-4xl font-bold'>9€</p>
                                    <p className='text-muted-foreground'>por mes</p>
                                </div>
                            </CardHeader>
                            <CardContent className='space-y-6'>
                                <ul className='space-y-3'>
                                    {proPlanFeatures.map((feature, index) => (
                                        <li key={index} className='flex items-center gap-3'>
                                            <CheckCircle className='text-success h-5 w-5' />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className='w-full' asChild>
                                    <Link href='/register'>Prueba Pro Gratis</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className='bg-primary text-primary-foreground py-24'>
                <div className='container mx-auto px-4 text-center'>
                    <div className='mx-auto max-w-3xl space-y-8'>
                        <h2 className='text-3xl font-bold sm:text-4xl'>¿Listo para tomar control de tus finanzas?</h2>
                        <p className='text-xl opacity-90'>
                            Únete a miles de usuarios que ya están gestionando sus finanzas de forma inteligente
                        </p>
                        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                            <Button size='lg' variant='secondary' className='px-8 text-lg' asChild>
                                <Link href='/register'>
                                    Comenzar Gratis
                                    <ArrowRight className='ml-2 h-5 w-5' />
                                </Link>
                            </Button>
                            <Button
                                size='lg'
                                variant='outline'
                                className='border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 text-lg'>
                                Contactar Ventas
                            </Button>
                        </div>

                        <div className='flex items-center justify-center gap-8 pt-8 opacity-75'>
                            <div className='flex items-center gap-2'>
                                <Globe className='h-5 w-5' />
                                <span>Disponible en España</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Smartphone className='h-5 w-5' />
                                <span>App móvil próximamente</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
