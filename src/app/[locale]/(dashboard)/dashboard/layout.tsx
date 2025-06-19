'use client';

import { ReactNode } from 'react';

import { redirect } from 'next/navigation';

import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAppSelector } from '@/lib/redux/store';

interface AuthenticatedLayoutProps {
    children: ReactNode;
}

export default function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
    const { isAuthenticated, initialized } = useAppSelector((state) => state.auth);

    // Show loading while checking auth state
    if (!initialized) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <div className='border-primary h-32 w-32 animate-spin rounded-full border-b-2'></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        redirect('/login');
    }

    return <DashboardLayout>{children}</DashboardLayout>;
}
