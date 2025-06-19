'use client';

import { ReactNode } from 'react';

import { persistor, store } from './store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

// Loading component for PersistGate
const LoadingFallback = () => (
    <div className='flex min-h-screen items-center justify-center'>
        <div className='border-primary h-32 w-32 animate-spin rounded-full border-b-2'></div>
    </div>
);

interface ReduxProvidersProps {
    children: ReactNode;
}

export default function ReduxProviders({ children }: ReduxProvidersProps) {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingFallback />} persistor={persistor}>
                {children}
            </PersistGate>
        </Provider>
    );
}
