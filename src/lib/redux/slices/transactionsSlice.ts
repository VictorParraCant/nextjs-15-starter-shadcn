import { db } from '@/lib/firebase/config';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    limit,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';

// Types
export interface Transaction {
    id: string;
    date: string;
    amount: number;
    type: 'expense' | 'income' | 'investment' | 'transfer';
    description: string;
    categoryId: string;
    categoryName?: string;
    sourceWalletId?: string;
    sourceWalletName?: string;
    destinationWalletId?: string;
    destinationWalletName?: string;
    createdFrom: 'manual' | 'csv' | 'pdf' | 'api';
    fileId?: string;
    groupId?: string;
    tags?: string[];
    notes?: string;
    isRecurring?: boolean;
    recurringData?: {
        frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
        interval: number;
        endDate?: string;
    };
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionData {
    date: string;
    amount: number;
    type: 'expense' | 'income' | 'investment' | 'transfer';
    description: string;
    categoryId: string;
    sourceWalletId?: string;
    destinationWalletId?: string;
    tags?: string[];
    notes?: string;
    isRecurring?: boolean;
    recurringData?: Transaction['recurringData'];
}

export interface UpdateTransactionData {
    id: string;
    date?: string;
    amount?: number;
    type?: 'expense' | 'income' | 'investment' | 'transfer';
    description?: string;
    categoryId?: string;
    sourceWalletId?: string;
    destinationWalletId?: string;
    tags?: string[];
    notes?: string;
}

export interface TransactionFilters {
    type?: 'expense' | 'income' | 'investment' | 'transfer';
    categoryId?: string;
    walletId?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
    searchTerm?: string;
    tags?: string[];
}

export interface TransactionSummary {
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
    netBalance: number;
    transactionCount: number;
    period: {
        start: string;
        end: string;
    };
}

interface TransactionsState {
    transactions: Transaction[];
    recentTransactions: Transaction[];
    filteredTransactions: Transaction[];
    currentFilters: TransactionFilters;
    summary: TransactionSummary | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    lastDoc: any;
    pagination: {
        page: number;
        limit: number;
        total: number;
    };
}

const initialState: TransactionsState = {
    transactions: [],
    recentTransactions: [],
    filteredTransactions: [],
    currentFilters: {},
    summary: null,
    isLoading: false,
    isLoadingMore: false,
    error: null,
    hasMore: true,
    lastDoc: null,
    pagination: {
        page: 1,
        limit: 50,
        total: 0
    }
};

// Async thunks
export const fetchTransactionsAsync = createAsyncThunk(
    'transactions/fetchTransactions',
    async ({
        userId,
        filters = {},
        pageSize = 50
    }: {
        userId: string;
        filters?: TransactionFilters;
        pageSize?: number;
    }) => {
        const transactionsRef = collection(db, 'users', userId, 'transactions');
        let q = query(transactionsRef, orderBy('date', 'desc'), limit(pageSize));

        // Apply filters
        if (filters.type) {
            q = query(q, where('type', '==', filters.type));
        }
        if (filters.categoryId) {
            q = query(q, where('categoryId', '==', filters.categoryId));
        }
        if (filters.walletId) {
            q = query(q, where('sourceWalletId', '==', filters.walletId));
        }
        if (filters.dateFrom) {
            q = query(q, where('date', '>=', filters.dateFrom));
        }
        if (filters.dateTo) {
            q = query(q, where('date', '<=', filters.dateTo));
        }

        const snapshot = await getDocs(q);

        const transactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString()
        })) as Transaction[];

        return {
            transactions,
            lastDoc: snapshot.docs[snapshot.docs.length - 1],
            hasMore: snapshot.docs.length === pageSize
        };
    }
);

export const fetchMoreTransactionsAsync = createAsyncThunk(
    'transactions/fetchMoreTransactions',
    async ({
        userId,
        filters = {},
        lastDoc,
        pageSize = 50
    }: {
        userId: string;
        filters?: TransactionFilters;
        lastDoc: any;
        pageSize?: number;
    }) => {
        const transactionsRef = collection(db, 'users', userId, 'transactions');
        let q = query(transactionsRef, orderBy('date', 'desc'), startAfter(lastDoc), limit(pageSize));

        // Apply same filters as initial fetch
        if (filters.type) {
            q = query(q, where('type', '==', filters.type));
        }

        const snapshot = await getDocs(q);

        const transactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString()
        })) as Transaction[];

        return {
            transactions,
            lastDoc: snapshot.docs[snapshot.docs.length - 1],
            hasMore: snapshot.docs.length === pageSize
        };
    }
);

export const fetchRecentTransactionsAsync = createAsyncThunk(
    'transactions/fetchRecentTransactions',
    async (userId: string) => {
        const transactionsRef = collection(db, 'users', userId, 'transactions');
        const q = query(transactionsRef, orderBy('createdAt', 'desc'), limit(10));

        const snapshot = await getDocs(q);

        const transactions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate().toISOString(),
            updatedAt: doc.data().updatedAt?.toDate().toISOString()
        })) as Transaction[];

        return transactions;
    }
);

export const createTransactionAsync = createAsyncThunk(
    'transactions/createTransaction',
    async ({
        userId,
        walletId,
        transactionData
    }: {
        userId: string;
        walletId: string;
        transactionData: CreateTransactionData;
    }) => {
        const transactionsRef = collection(db, 'users', userId, 'wallets', walletId, 'transactions');

        const newTransaction = {
            ...transactionData,
            userId,
            createdFrom: 'manual' as const,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const docRef = await addDoc(transactionsRef, newTransaction);

        return {
            id: docRef.id,
            ...transactionData,
            userId,
            createdFrom: 'manual' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as Transaction;
    }
);

export const updateTransactionAsync = createAsyncThunk(
    'transactions/updateTransaction',
    async ({
        userId,
        walletId,
        transactionData
    }: {
        userId: string;
        walletId: string;
        transactionData: UpdateTransactionData;
    }) => {
        const transactionRef = doc(db, 'users', userId, 'wallets', walletId, 'transactions', transactionData.id);

        const updateData = {
            ...transactionData,
            updatedAt: serverTimestamp()
        };
        delete updateData.id;

        await updateDoc(transactionRef, updateData);

        return {
            ...transactionData,
            updatedAt: new Date().toISOString()
        };
    }
);

export const deleteTransactionAsync = createAsyncThunk(
    'transactions/deleteTransaction',
    async ({ userId, walletId, transactionId }: { userId: string; walletId: string; transactionId: string }) => {
        const transactionRef = doc(db, 'users', userId, 'wallets', walletId, 'transactions', transactionId);

        await deleteDoc(transactionRef);

        return transactionId;
    }
);

export const createBulkTransactionsAsync = createAsyncThunk(
    'transactions/createBulkTransactions',
    async ({
        userId,
        walletId,
        transactions
    }: {
        userId: string;
        walletId: string;
        transactions: CreateTransactionData[];
    }) => {
        const batch = writeBatch(db);
        const transactionsRef = collection(db, 'users', userId, 'wallets', walletId, 'transactions');

        const newTransactions = transactions.map((transaction) => {
            const docRef = doc(transactionsRef);
            const newTransaction = {
                ...transaction,
                userId,
                createdFrom: 'csv' as const,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            };

            batch.set(docRef, newTransaction);

            return {
                id: docRef.id,
                ...newTransaction,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            } as Transaction;
        });

        await batch.commit();

        return newTransactions;
    }
);

export const calculateSummaryAsync = createAsyncThunk(
    'transactions/calculateSummary',
    async ({ userId, dateFrom, dateTo }: { userId: string; dateFrom: string; dateTo: string }) => {
        const transactionsRef = collection(db, 'users', userId, 'transactions');
        const q = query(transactionsRef, where('date', '>=', dateFrom), where('date', '<=', dateTo));

        const snapshot = await getDocs(q);

        let totalIncome = 0;
        let totalExpenses = 0;
        let totalInvestments = 0;

        snapshot.docs.forEach((doc) => {
            const transaction = doc.data() as Transaction;
            switch (transaction.type) {
                case 'income':
                    totalIncome += transaction.amount;
                    break;
                case 'expense':
                    totalExpenses += Math.abs(transaction.amount);
                    break;
                case 'investment':
                    totalInvestments += Math.abs(transaction.amount);
                    break;
            }
        });

        return {
            totalIncome,
            totalExpenses,
            totalInvestments,
            netBalance: totalIncome - totalExpenses - totalInvestments,
            transactionCount: snapshot.docs.length,
            period: {
                start: dateFrom,
                end: dateTo
            }
        } as TransactionSummary;
    }
);

// Slice
const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<TransactionFilters>) => {
            state.currentFilters = action.payload;
            // Reset pagination when filters change
            state.pagination.page = 1;
            state.hasMore = true;
            state.lastDoc = null;
        },
        clearFilters: (state) => {
            state.currentFilters = {};
            state.filteredTransactions = state.transactions;
            state.pagination.page = 1;
            state.hasMore = true;
            state.lastDoc = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearTransactions: (state) => {
            state.transactions = [];
            state.recentTransactions = [];
            state.filteredTransactions = [];
            state.summary = null;
            state.pagination = {
                page: 1,
                limit: 50,
                total: 0
            };
            state.hasMore = true;
            state.lastDoc = null;
        },
        optimisticAddTransaction: (state, action: PayloadAction<Transaction>) => {
            state.transactions.unshift(action.payload);
            state.recentTransactions.unshift(action.payload);
            if (state.recentTransactions.length > 10) {
                state.recentTransactions.pop();
            }
        },
        optimisticUpdateTransaction: (state, action: PayloadAction<UpdateTransactionData>) => {
            const index = state.transactions.findIndex((t) => t.id === action.payload.id);
            if (index !== -1) {
                state.transactions[index] = { ...state.transactions[index], ...action.payload };
            }

            const recentIndex = state.recentTransactions.findIndex((t) => t.id === action.payload.id);
            if (recentIndex !== -1) {
                state.recentTransactions[recentIndex] = {
                    ...state.recentTransactions[recentIndex],
                    ...action.payload
                };
            }
        },
        optimisticDeleteTransaction: (state, action: PayloadAction<string>) => {
            state.transactions = state.transactions.filter((t) => t.id !== action.payload);
            state.recentTransactions = state.recentTransactions.filter((t) => t.id !== action.payload);
            state.filteredTransactions = state.filteredTransactions.filter((t) => t.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        // Fetch transactions
        builder
            .addCase(fetchTransactionsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchTransactionsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = action.payload.transactions;
                state.filteredTransactions = action.payload.transactions;
                state.lastDoc = action.payload.lastDoc;
                state.hasMore = action.payload.hasMore;
                state.pagination.total = action.payload.transactions.length;
            })
            .addCase(fetchTransactionsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al cargar transacciones';
            });

        // Fetch more transactions
        builder
            .addCase(fetchMoreTransactionsAsync.pending, (state) => {
                state.isLoadingMore = true;
            })
            .addCase(fetchMoreTransactionsAsync.fulfilled, (state, action) => {
                state.isLoadingMore = false;
                state.transactions.push(...action.payload.transactions);
                state.filteredTransactions.push(...action.payload.transactions);
                state.lastDoc = action.payload.lastDoc;
                state.hasMore = action.payload.hasMore;
                state.pagination.page += 1;
                state.pagination.total += action.payload.transactions.length;
            })
            .addCase(fetchMoreTransactionsAsync.rejected, (state, action) => {
                state.isLoadingMore = false;
                state.error = action.error.message || 'Error al cargar más transacciones';
            });

        // Fetch recent transactions
        builder.addCase(fetchRecentTransactionsAsync.fulfilled, (state, action) => {
            state.recentTransactions = action.payload;
        });

        // Create transaction
        builder
            .addCase(createTransactionAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createTransactionAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions.unshift(action.payload);
                state.recentTransactions.unshift(action.payload);
                if (state.recentTransactions.length > 10) {
                    state.recentTransactions.pop();
                }
            })
            .addCase(createTransactionAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al crear transacción';
            });

        // Update transaction
        builder
            .addCase(updateTransactionAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateTransactionAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.transactions.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.transactions[index] = { ...state.transactions[index], ...action.payload };
                }

                const recentIndex = state.recentTransactions.findIndex((t) => t.id === action.payload.id);
                if (recentIndex !== -1) {
                    state.recentTransactions[recentIndex] = {
                        ...state.recentTransactions[recentIndex],
                        ...action.payload
                    };
                }
            })
            .addCase(updateTransactionAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al actualizar transacción';
            });

        // Delete transaction
        builder
            .addCase(deleteTransactionAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteTransactionAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = state.transactions.filter((t) => t.id !== action.payload);
                state.recentTransactions = state.recentTransactions.filter((t) => t.id !== action.payload);
                state.filteredTransactions = state.filteredTransactions.filter((t) => t.id !== action.payload);
            })
            .addCase(deleteTransactionAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al eliminar transacción';
            });

        // Bulk create transactions
        builder
            .addCase(createBulkTransactionsAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBulkTransactionsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.transactions = [...action.payload, ...state.transactions];
                // Update recent transactions with newest ones
                const newest = action.payload.slice(0, 10 - state.recentTransactions.length);
                state.recentTransactions = [...newest, ...state.recentTransactions].slice(0, 10);
            })
            .addCase(createBulkTransactionsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Error al importar transacciones';
            });

        // Calculate summary
        builder
            .addCase(calculateSummaryAsync.fulfilled, (state, action) => {
                state.summary = action.payload;
            })
            .addCase(calculateSummaryAsync.rejected, (state, action) => {
                state.error = action.error.message || 'Error al calcular resumen';
            });
    }
});

// Selectors
export const selectTransactions = (state: { transactions: TransactionsState }) => state.transactions.transactions;

export const selectRecentTransactions = (state: { transactions: TransactionsState }) =>
    state.transactions.recentTransactions;

export const selectFilteredTransactions = (state: { transactions: TransactionsState }) =>
    state.transactions.filteredTransactions;

export const selectTransactionsByType = (state: { transactions: TransactionsState }, type: Transaction['type']) =>
    state.transactions.transactions.filter((t) => t.type === type);

export const selectTransactionsByDateRange = (
    state: { transactions: TransactionsState },
    startDate: string,
    endDate: string
) => state.transactions.transactions.filter((t) => t.date >= startDate && t.date <= endDate);

export const selectTransactionsByWallet = (state: { transactions: TransactionsState }, walletId: string) =>
    state.transactions.transactions.filter((t) => t.sourceWalletId === walletId || t.destinationWalletId === walletId);

export const selectTransactionsSummary = (state: { transactions: TransactionsState }) => state.transactions.summary;

export const selectCurrentFilters = (state: { transactions: TransactionsState }) => state.transactions.currentFilters;

export const selectTransactionsPagination = (state: { transactions: TransactionsState }) =>
    state.transactions.pagination;

export const selectIsLoadingTransactions = (state: { transactions: TransactionsState }) => state.transactions.isLoading;

export const selectIsLoadingMoreTransactions = (state: { transactions: TransactionsState }) =>
    state.transactions.isLoadingMore;

export const selectHasMoreTransactions = (state: { transactions: TransactionsState }) => state.transactions.hasMore;

export const selectTransactionsError = (state: { transactions: TransactionsState }) => state.transactions.error;

// Advanced selectors
export const selectTransactionsByCategory = (state: { transactions: TransactionsState }, categoryId: string) =>
    state.transactions.transactions.filter((t) => t.categoryId === categoryId);

export const selectExpensesByCategory = (state: { transactions: TransactionsState }) => {
    const expenses = state.transactions.transactions.filter((t) => t.type === 'expense');
    const grouped = expenses.reduce(
        (acc, transaction) => {
            const categoryId = transaction.categoryId;
            if (!acc[categoryId]) {
                acc[categoryId] = {
                    categoryId,
                    categoryName: transaction.categoryName || 'Sin categoría',
                    total: 0,
                    count: 0,
                    transactions: []
                };
            }
            acc[categoryId].total += Math.abs(transaction.amount);
            acc[categoryId].count += 1;
            acc[categoryId].transactions.push(transaction);
            return acc;
        },
        {} as Record<
            string,
            {
                categoryId: string;
                categoryName: string;
                total: number;
                count: number;
                transactions: Transaction[];
            }
        >
    );

    return Object.values(grouped).sort((a, b) => b.total - a.total);
};

export const selectMonthlyTransactionsSummary = (
    state: { transactions: TransactionsState },
    year: number,
    month: number
) => {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const monthlyTransactions = state.transactions.transactions.filter((t) => t.date >= startDate && t.date <= endDate);

    const summary = monthlyTransactions.reduce(
        (acc, transaction) => {
            switch (transaction.type) {
                case 'income':
                    acc.income += transaction.amount;
                    break;
                case 'expense':
                    acc.expenses += Math.abs(transaction.amount);
                    break;
                case 'investment':
                    acc.investments += Math.abs(transaction.amount);
                    break;
            }
            return acc;
        },
        { income: 0, expenses: 0, investments: 0 }
    );

    return {
        ...summary,
        balance: summary.income - summary.expenses - summary.investments,
        count: monthlyTransactions.length,
        period: { startDate, endDate }
    };
};

export const selectRecentTransactionsByWallet = (
    state: { transactions: TransactionsState },
    walletId: string,
    limit = 5
) =>
    state.transactions.transactions
        .filter((t) => t.sourceWalletId === walletId || t.destinationWalletId === walletId)
        .slice(0, limit);

export const selectTransactionTrends = (state: { transactions: TransactionsState }, months = 6) => {
    const now = new Date();
    const trends = [];

    for (let i = months - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;

        const monthSummary = selectMonthlyTransactionsSummary({ transactions: state.transactions }, year, month);

        trends.push({
            month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
            date: date.toISOString().split('T')[0],
            ...monthSummary
        });
    }

    return trends;
};

export const {
    setFilters,
    clearFilters,
    clearError,
    clearTransactions,
    optimisticAddTransaction,
    optimisticUpdateTransaction,
    optimisticDeleteTransaction
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
