'use client';

import { ReactNode, useEffect } from 'react';

import { auth, db } from '@/lib/firebase/config';
import { setInitialized, setLoading, setUser } from '@/lib/redux/slices/authSlice';
import type { User } from '@/lib/redux/slices/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/redux/store';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    const dispatch = useAppDispatch();
    const { initialized } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(setLoading(true));

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                if (firebaseUser) {
                    // Get additional user data from Firestore
                    const userDocRef = doc(db, 'users', firebaseUser.uid);
                    const userDoc = await getDoc(userDocRef);

                    const userData: User = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email!,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        emailVerified: firebaseUser.emailVerified,
                        ...userDoc.data()
                    };

                    dispatch(setUser(userData));
                } else {
                    dispatch(setUser(null));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                dispatch(setUser(null));
            } finally {
                dispatch(setLoading(false));
                dispatch(setInitialized(true));
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    // Show loading state while initializing auth
    if (!initialized) {
        return (
            <div className='flex min-h-screen items-center justify-center'>
                <div className='border-primary h-32 w-32 animate-spin rounded-full border-b-2'></div>
            </div>
        );
    }

    return <>{children}</>;
}
