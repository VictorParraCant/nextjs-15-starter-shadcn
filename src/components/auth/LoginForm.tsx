'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { loginAsync } from '@/lib/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';
import { zodResolver } from '@hookform/resolvers/zod';

import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
    email: z.string().min(1, 'El email es requerido').email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
    rememberMe: z.boolean().default(false)
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const t = useTranslations('auth.login');
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    const rememberMe = watch('rememberMe');

    const onSubmit = async (data: LoginFormData) => {
        try {
            const result = await dispatch(
                loginAsync({
                    email: data.email,
                    password: data.password
                })
            );

            if (loginAsync.fulfilled.match(result)) {
                toast.success('¡Bienvenido de vuelta!');
                router.push('/dashboard');
            } else {
                throw new Error((result.payload as string) || 'Error de inicio de sesión');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.message || t('errors.generic'));
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // TODO: Implement Google OAuth
            toast.error('Google OAuth próximamente disponible');
        } catch (error: any) {
            toast.error('Error al iniciar sesión con Google');
        }
    };

    return (
        <div className='space-y-6'>
            {/* Google Login */}
            <Button type='button' variant='outline' className='w-full' onClick={handleGoogleLogin} disabled={isLoading}>
                <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                    <path
                        fill='currentColor'
                        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                    />
                    <path
                        fill='currentColor'
                        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                    />
                    <path
                        fill='currentColor'
                        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                    />
                    <path
                        fill='currentColor'
                        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                    />
                </svg>
                {t('loginWith')} {t('google')}
            </Button>

            <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                    <Separator className='w-full' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-background text-muted-foreground px-2'>O continúa con</span>
                </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                {/* Email */}
                <div className='space-y-2'>
                    <Label htmlFor='email'>{t('email')}</Label>
                    <div className='relative'>
                        <Mail className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                        <Input
                            id='email'
                            type='email'
                            placeholder={t('emailPlaceholder')}
                            className='pl-10'
                            disabled={isLoading}
                            {...register('email')}
                        />
                    </div>
                    {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                        <Label htmlFor='password'>{t('password')}</Label>
                        <Link href='/forgot-password' className='text-primary text-sm hover:underline'>
                            {t('forgotPassword')}
                        </Link>
                    </div>
                    <div className='relative'>
                        <Lock className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                        <Input
                            id='password'
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('passwordPlaceholder')}
                            className='pr-10 pl-10'
                            disabled={isLoading}
                            {...register('password')}
                        />
                        <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            className='absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent'
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}>
                            {showPassword ? (
                                <EyeOff className='text-muted-foreground h-4 w-4' />
                            ) : (
                                <Eye className='text-muted-foreground h-4 w-4' />
                            )}
                        </Button>
                    </div>
                    {errors.password && <p className='text-destructive text-sm'>{errors.password.message}</p>}
                </div>

                {/* Remember Me */}
                <div className='flex items-center space-x-2'>
                    <Checkbox
                        id='rememberMe'
                        checked={rememberMe}
                        onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
                        disabled={isLoading}
                    />
                    <Label htmlFor='rememberMe' className='cursor-pointer text-sm font-normal'>
                        {t('rememberMe')}
                    </Label>
                </div>

                {/* Submit Button */}
                <Button type='submit' className='w-full' disabled={isLoading} size='lg'>
                    {isLoading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Iniciando sesión...
                        </>
                    ) : (
                        t('submit')
                    )}
                </Button>
            </form>

            {/* Security Info */}
            <div className='text-muted-foreground text-center text-xs'>
                <p>
                    Al iniciar sesión, aceptas nuestros{' '}
                    <Link href='/legal/terms' className='text-primary hover:underline'>
                        Términos de Servicio
                    </Link>{' '}
                    y{' '}
                    <Link href='/legal/privacy' className='text-primary hover:underline'>
                        Política de Privacidad
                    </Link>
                </p>
            </div>
        </div>
    );
}
