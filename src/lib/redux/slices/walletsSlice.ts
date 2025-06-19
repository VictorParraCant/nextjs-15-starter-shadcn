import { db } from '@/lib/firebase/config';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';

// Types
export interface Wallet {
    id: string;
    name: string;
    type: 'bank' | 'cash' | 'broker' | 'other';
    institution?: string;
    initialBalance: number;
    currentBalance: number;
    currency: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateWalletData {
    name: string;
    type: 'bank' | 'cash' | 'broker' | 'other';
    institution?: string;
    initialBalance: number;
    currency: string;
}

export interface UpdateWalletData {
    id: string;
    name?: string;
    type?: 'bank' | 'cash' | 'broker' | 'other';
    institution?: string;
    isActive?: boolean;
}

interface WalletsState {
    wallets: Wallet[];
    selectedWalletId: string | null;
    isLoading: boolean;
    error: string | null;
    totalBalance: number;
    lastSync: string | null;
}

const initialState: WalletsState = {
    wallets: [],
    selectedWalletId: null,
    isLoading: false,
    error: null,
    totalBalance: 0,
    lastSync: null
};

// Async thunks
export const fetchWalletsAsync = createAsyncThunk('wallets/fetchWallets', async (userId: string) => {
    const walletsRef = collection(db, 'users', userId, 'wallets');
    const q = query(walletsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const wallets = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString(),
        updatedAt: doc.data().updatedAt?.toDate().toISOString()
    })) as Wallet[];

    return wallets;
});

export const createWalletAsync = createAsyncThunk(
    'wallets/createWallet',
    async ({ userId, walletData }: { userId: string; walletData: CreateWalletData }) => {
        const walletsRef = collection(db, 'users', userId, 'wallets');

        const newWallet = {
            ...walletData,
            currentBalance: walletData.initialBalance,
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(walletsRef, newWallet);

        return {
            id: docRef.id,
            ...walletData,
            currentBalance: walletData.initialBalance,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as Wallet;
    }
);

export const updateWalletAsync = createAsyncThunk(
    'wallets/updateWallet',
    async ({ userId, walletData }: { userId: string; walletData: UpdateWalletData }) => {
        const walletRef = doc(db, 'users', userId, 'wallets', walletData.id);

        const updateData = {
            ...walletData,
            updatedAt: serverTimestamp()
        };
        delete updateData.id;

        await updateDoc(walletRef, updateData);

        return {
            ...walletData,
            updatedAt: new Date().toISOString()
        };
    }
);

export const deleteWalletAsync = createAsyncThunk(
    'wallets/deleteWallet',
    async ({ userId, walletId }: { userId: string; walletId: string }) => {
        // Soft delete - mark as inactive instead of actual deletion
        const walletRef = doc(db, 'users', userId, 'wallets', walletId);

        await updateDoc(walletRef, {
            isActive: false,
            updatedAt: serverTimestamp()
        });

        return walletId;
    }
);

export const updateWalletBalanceAsync = createAsyncThunk(
    'wallets/updateBalance',
    async ({
        userId,
        walletId,
        amount,
        operation
    }: {
        userId: string;
        walletId: string;
        amount: number;
        operation: 'add' | 'subtract' | 'set';
    }) => {
        const walletRef = doc(db, 'users', userId, 'wallets', walletId);

        // This would typically be done with a transaction or cloud function
        // For now, we'll handle it optimistically
        return {
            walletId,
            amount,
            operation
        };
    }
);

export const syncWalletBalancesAsync = createAsyncThunk('wallets/syncBalances', async (userId: string) => {
    // This would calculate balances based on transactions
    // For now, return mock data
    const walletsRef = collection(db, 'users', userId, 'wallets');
    const snapshot = await getDocs(walletsRef);

    const balanceUpdates = snapshot.docs.map((doc) => ({
        id: doc.id,
        currentBalance: doc.data().initialBalance // This would be calculated
    }));

    return balanceUpdates;
});

// Slice
const walletsSlice = createSlice({
    name: 'wallets',
    initialState,
    reducers: {
        setSelectedWallet: (state, action: PayloadAction<string | null>) => {
            state.selectedWalletId = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearWallets: (state) => {
            state.wallets = [];
            state.selectedWalletId = null;
            state.totalBalance = 0;
            state.lastSync = null;
        },
        optimisticUpdateBalance: (
            state,
            action: PayloadAction<{
                walletId: string;
                amount: number;
                operation: 'add' | 'subtract' | 'set';
            }>
        ) => {
            const { walletId, amount, operation } = action.payload;
            const wallet = state.wallets.find((w) => w.id === walletId);

            if (wallet) {
                switch (operation) {
                    case 'add':
                        wallet.currentBalance += amount;
                        break;
                    case 'subtract':
                        wallet.currentBalance -= amount;
                        break;
                    case 'set':
                        wallet.currentBalance = amount;
                        break;
                }

                // Recalculate total balance
                state.totalBalance = state.wallets
                    .filter((w) => w.isActive)
                    .reduce((total, w) => total + w.currentBalance, 0);
            }
        }
    },
    extraReducers: (builder) => {
        // Fetch wallets
        builder
            .addCase(fetchWalletsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchWalletsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wallets = action.payload;
                state.totalBalance = action.payload
                    .filter((w) => w.isActive)
                    .reduce((total, wallet) => total + wallet.currentBalance, 0);
                state.lastSync = new Date().toISOString();
            })
            .addCase(fetchWalletsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al cargar carteras';
            });

        // Create wallet
        builder
            .addCase(createWalletAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createWalletAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wallets.unshift(action.payload);
                state.totalBalance += action.payload.currentBalance;
            })
            .addCase(createWalletAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al crear cartera';
            });

        // Update wallet
        builder
            .addCase(updateWalletAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateWalletAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.wallets.findIndex((w) => w.id === action.payload.id);
                if (index !== -1) {
                    state.wallets[index] = { ...state.wallets[index], ...action.payload };
                }
            })
            .addCase(updateWalletAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al actualizar cartera';
            });

        // Delete wallet
        builder
            .addCase(deleteWalletAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteWalletAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const wallet = state.wallets.find((w) => w.id === action.payload);
                if (wallet) {
                    wallet.isActive = false;
                    state.totalBalance -= wallet.currentBalance;
                }
                if (state.selectedWalletId === action.payload) {
                    state.selectedWalletId = null;
                }
            })
            .addCase(deleteWalletAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al eliminar cartera';
            });

        // Sync balances
        builder
            .addCase(syncWalletBalancesAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(syncWalletBalancesAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                action.payload.forEach((update) => {
                    const wallet = state.wallets.find((w) => w.id === update.id);
                    if (wallet) {
                        wallet.currentBalance = update.currentBalance;
                    }
                });
                state.totalBalance = state.wallets
                    .filter((w) => w.isActive)
                    .reduce((total, w) => total + w.currentBalance, 0);
                state.lastSync = new Date().toISOString();
            })
            .addCase(syncWalletBalancesAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al sincronizar balances';
            });
    }
});

// Selectors
export const selectWallets = (state: { wallets: WalletsState }) => state.wallets.wallets;
export const selectActiveWallets = (state: { wallets: WalletsState }) =>
    state.wallets.wallets.filter((w) => w.isActive);
export const selectSelectedWallet = (state: { wallets: WalletsState }) => {
    if (!state.wallets.selectedWalletId) return null;
    return state.wallets.wallets.find((w) => w.id === state.wallets.selectedWalletId) || null;
};
export const selectTotalBalance = (state: { wallets: WalletsState }) => state.wallets.totalBalance;
export const selectWalletsByType = (state: { wallets: WalletsState }, type: Wallet['type']) =>
    state.wallets.wallets.filter((w) => w.isActive && w.type === type);

export const { setSelectedWallet, clearError, clearWallets, optimisticUpdateBalance } = walletsSlice.actions;

export default walletsSlice.reducer;
