'use client';

import { useState } from 'react';

import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAppSelector } from '@/lib/redux/store';

import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';
import { BarChart3, CreditCard, LayoutDashboard, LogOut, Menu, Settings, User, Users, Wallet } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Navigation() {
    const t = useTranslations();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(false);

    const publicNavItems = [
        { href: '/features', label: t('nav.features') },
        { href: '/pricing', label: t('nav.pricing') },
        { href: '/about', label: t('nav.about') },
        { href: '/contact', label: t('nav.contact') }
    ];

    const authenticatedNavItems = [
        { href: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
        { href: '/wallets', label: t('nav.wallets'), icon: Wallet },
        { href: '/transactions', label: t('nav.transactions'), icon: CreditCard },
        { href: '/groups', label: t('nav.groups'), icon: Users }
    ];

    const getUserInitials = (name: string | null) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className='bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur'>
            <div className='container mx-auto px-4'>
                <div className='flex h-16 items-center justify-between'>
                    {/* Logo */}
                    <Link href='/' className='flex items-center space-x-2'>
                        <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg font-bold'>
                            F
                        </div>
                        <span className='text-xl font-bold'>FIMA</span>
                        <Badge variant='secondary' className='hidden sm:inline-flex'>
                            Beta
                        </Badge>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden items-center space-x-8 md:flex'>
                        {isAuthenticated
                            ? // Authenticated Navigation
                              authenticatedNavItems.map((item) => (
                                  <Link
                                      key={item.href}
                                      href={item.href}
                                      className='text-muted-foreground hover:text-foreground flex items-center space-x-1 text-sm font-medium transition-colors'>
                                      <item.icon className='h-4 w-4' />
                                      <span>{item.label}</span>
                                  </Link>
                              ))
                            : // Public Navigation
                              publicNavItems.map((item) => (
                                  <Link
                                      key={item.href}
                                      href={item.href}
                                      className='text-muted-foreground hover:text-foreground text-sm font-medium transition-colors'>
                                      {item.label}
                                  </Link>
                              ))}
                    </div>

                    {/* Right Side */}
                    <div className='flex items-center space-x-4'>
                        <ThemeToggle />
                        <LanguageToggle />

                        {isAuthenticated && user ? (
                            // User Menu
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
                                        <Avatar className='h-8 w-8'>
                                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                                            <AvatarFallback className='bg-primary text-primary-foreground'>
                                                {getUserInitials(user.displayName)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-56' align='end'>
                                    <div className='flex items-center justify-start gap-2 p-2'>
                                        <div className='flex flex-col space-y-1 leading-none'>
                                            {user.displayName && <p className='font-medium'>{user.displayName}</p>}
                                            <p className='text-muted-foreground w-[200px] truncate text-sm'>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href='/dashboard' className='flex items-center'>
                                            <LayoutDashboard className='mr-2 h-4 w-4' />
                                            <span>{t('nav.dashboard')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href='/account' className='flex items-center'>
                                            <User className='mr-2 h-4 w-4' />
                                            <span>{t('nav.account')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href='/settings' className='flex items-center'>
                                            <Settings className='mr-2 h-4 w-4' />
                                            <span>{t('nav.settings')}</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className='text-destructive'>
                                        <LogOut className='mr-2 h-4 w-4' />
                                        <span>{t('common.logout')}</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            // Auth Buttons
                            <div className='hidden items-center space-x-2 md:flex'>
                                <Button variant='ghost' asChild>
                                    <Link href='/login'>{t('nav.login')}</Link>
                                </Button>
                                <Button asChild>
                                    <Link href='/register'>{t('nav.register')}</Link>
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild className='md:hidden'>
                                <Button variant='ghost' size='icon'>
                                    <Menu className='h-5 w-5' />
                                    <span className='sr-only'>Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side='right' className='w-[300px]'>
                                <div className='mt-4 flex flex-col space-y-4'>
                                    {isAuthenticated ? (
                                        <>
                                            {/* User Info */}
                                            {user && (
                                                <div className='flex items-center space-x-3 rounded-lg border p-4'>
                                                    <Avatar className='h-10 w-10'>
                                                        <AvatarImage
                                                            src={user.photoURL || ''}
                                                            alt={user.displayName || ''}
                                                        />
                                                        <AvatarFallback className='bg-primary text-primary-foreground'>
                                                            {getUserInitials(user.displayName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className='flex flex-col'>
                                                        <p className='font-medium'>{user.displayName}</p>
                                                        <p className='text-muted-foreground text-sm'>{user.email}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Authenticated Navigation */}
                                            {authenticatedNavItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className='hover:bg-accent flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors'
                                                    onClick={() => setIsOpen(false)}>
                                                    <item.icon className='h-4 w-4' />
                                                    <span>{item.label}</span>
                                                </Link>
                                            ))}

                                            <div className='border-t pt-4'>
                                                <Link
                                                    href='/account'
                                                    className='hover:bg-accent flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors'
                                                    onClick={() => setIsOpen(false)}>
                                                    <User className='h-4 w-4' />
                                                    <span>{t('nav.account')}</span>
                                                </Link>
                                                <Link
                                                    href='/settings'
                                                    className='hover:bg-accent flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors'
                                                    onClick={() => setIsOpen(false)}>
                                                    <Settings className='h-4 w-4' />
                                                    <span>{t('nav.settings')}</span>
                                                </Link>
                                                <Button
                                                    variant='ghost'
                                                    className='text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start'
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                        // Handle logout
                                                    }}>
                                                    <LogOut className='mr-2 h-4 w-4' />
                                                    {t('common.logout')}
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Public Navigation */}
                                            {publicNavItems.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    className='hover:bg-accent rounded-md p-2 text-sm font-medium transition-colors'
                                                    onClick={() => setIsOpen(false)}>
                                                    {item.label}
                                                </Link>
                                            ))}

                                            {/* Auth Buttons */}
                                            <div className='space-y-2 border-t pt-4'>
                                                <Button variant='outline' className='w-full' asChild>
                                                    <Link href='/login' onClick={() => setIsOpen(false)}>
                                                        {t('nav.login')}
                                                    </Link>
                                                </Button>
                                                <Button className='w-full' asChild>
                                                    <Link href='/register' onClick={() => setIsOpen(false)}>
                                                        {t('nav.register')}
                                                    </Link>
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
