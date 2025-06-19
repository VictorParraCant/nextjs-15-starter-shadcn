'use client';

import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Globe } from 'lucide-react';

const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ca', name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' }
];

export default function LanguageToggle() {
    const router = useRouter();
    const params = useParams();
    const currentLocale = (params?.locale as string) || 'es';

    const handleLanguageChange = (newLocale: string) => {
        // Get current path without locale
        const pathname = window.location.pathname;
        const segments = pathname.split('/').filter(Boolean);

        // Remove current locale from segments if it exists
        if (languages.some((lang) => lang.code === segments[0])) {
            segments.shift();
        }

        // Build new path with new locale
        const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;

        router.push(newPath);
    };

    const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <Globe className='h-4 w-4' />
                    <span className='sr-only'>Cambiar idioma</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language.code)}
                        className={currentLocale === language.code ? 'bg-accent' : ''}>
                        <span className='mr-2'>{language.flag}</span>
                        <span>{language.name}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
