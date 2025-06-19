import { auth, db } from '@/lib/firebase/config';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { User as FirebaseUser } from 'firebase/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Types
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    createdAt?: string;
    defaultCurrency?: string;
    settings?: {
        theme: 'light' | 'dark' | 'system';
        language: string;
        notificationPreferences: {
            email: boolean;
            push: boolean;
            budgetAlerts: boolean;
        };
    };
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
    initialized: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    initialized: false
};

// Async thunks
export const loginAsync = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            emailVerified: userCredential.user.emailVerified,
            ...userDoc.data()
        };
    }
);

export const registerAsync = createAsyncThunk(
    'auth/register',
    async ({ email, password, displayName }: { email: string; password: string; displayName: string }) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update profile
        await updateProfile(userCredential.user, { displayName });

        // Create user document
        const userData = {
            email,
            displayName,
            createdAt: new Date().toISOString(),
            defaultCurrency: 'EUR',
            settings: {
                theme: 'system' as const,
                language: 'es',
                notificationPreferences: {
                    email: true,
                    push: true,
                    budgetAlerts: true
                }
            }
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), userData);

        return {
            uid: userCredential.user.uid,
            email: userCredential.user.email!,
            displayName: userCredential.user.displayName,
            photoURL: userCredential.user.photoURL,
            emailVerified: userCredential.user.emailVerified,
            ...userData
        };
    }
);

export const logoutAsync = createAsyncThunk('auth/logout', async () => {
    await signOut(auth);
});

export const updateUserProfileAsync = createAsyncThunk(
    'auth/updateProfile',
    async (updates: Partial<User>, { getState }) => {
        const state = getState() as { auth: AuthState };
        const userId = state.auth.user?.uid;

        if (!userId) throw new Error('User not authenticated');

        // Update Firestore
        await setDoc(doc(db, 'users', userId), updates, { merge: true });

        return updates;
    }
);

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            state.initialized = true;
            state.isLoading = false;
        },
        clearError: (state) => {
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setInitialized: (state, action: PayloadAction<boolean>) => {
            state.initialized = action.payload;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error de inicio de sesión';
            });

        // Register
        builder
            .addCase(registerAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error de registro';
            });

        // Logout
        builder
            .addCase(logoutAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al cerrar sesión';
            });

        // Update Profile
        builder
            .addCase(updateUserProfileAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.user) {
                    state.user = { ...state.user, ...action.payload };
                }
            })
            .addCase(updateUserProfileAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al actualizar perfil';
            });
    }
});

export const { setUser, clearError, setLoading, setInitialized } = authSlice.actions;
export default authSlice.reducer;
