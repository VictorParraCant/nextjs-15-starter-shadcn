import { PayloadAction, createSlice } from '@reduxjs/toolkit';

// Types
export type ThemeMode = 'light' | 'dark' | 'system';
export type Language = 'es' | 'en' | 'ca';
export type Currency = 'EUR' | 'USD' | 'GBP';

export interface NotificationSettings {
    email: boolean;
    push: boolean;
    budgetAlerts: boolean;
    transactionAlerts: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
}

export interface ViewPreferences {
    dashboardLayout: 'grid' | 'list';
    transactionView: 'table' | 'cards';
    chartType: 'line' | 'bar' | 'pie';
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    numberFormat: 'european' | 'american';
    showDecimals: boolean;
    compactMode: boolean;
}

export interface SidebarState {
    isOpen: boolean;
    isCollapsed: boolean;
    activeSection: string;
}

export interface ModalState {
    isOpen: boolean;
    type: 'transaction' | 'wallet' | 'category' | 'file' | 'group' | null;
    data?: any;
}

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    actions?: Array<{
        label: string;
        action: () => void;
    }>;
}

export interface LoadingState {
    global: boolean;
    auth: boolean;
    wallets: boolean;
    transactions: boolean;
    files: boolean;
    sync: boolean;
}

interface UIState {
    // Theme and appearance
    theme: ThemeMode;
    language: Language;
    currency: Currency;

    // Notifications
    notifications: NotificationSettings;

    // View preferences
    viewPreferences: ViewPreferences;

    // Navigation and layout
    sidebar: SidebarState;

    // Modals and dialogs
    modal: ModalState;

    // Toast notifications
    toasts: Toast[];

    // Loading states
    loading: LoadingState;

    // Connection and sync
    isOnline: boolean;
    lastSync: string | null;
    syncInProgress: boolean;

    // Search and filters
    globalSearch: string;
    quickFilters: {
        dateRange: 'today' | 'week' | 'month' | 'year' | 'custom';
        customDateRange?: {
            start: string;
            end: string;
        };
        categories: string[];
        wallets: string[];
        types: ('income' | 'expense' | 'investment' | 'transfer')[];
    };

    // Tutorial and onboarding
    onboarding: {
        completed: boolean;
        currentStep: number;
        skipped: boolean;
    };

    // Feature flags
    features: {
        betaFeatures: boolean;
        advancedAnalytics: boolean;
        apiIntegrations: boolean;
        collaborativeFeatures: boolean;
    };

    // Error handling
    errors: Array<{
        id: string;
        type: 'network' | 'auth' | 'validation' | 'server';
        message: string;
        timestamp: string;
        context?: any;
    }>;
}

const initialState: UIState = {
    // Theme and appearance
    theme: 'system',
    language: 'es',
    currency: 'EUR',

    // Notifications
    notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        transactionAlerts: false,
        weeklyReports: true,
        monthlyReports: true
    },

    // View preferences
    viewPreferences: {
        dashboardLayout: 'grid',
        transactionView: 'table',
        chartType: 'line',
        dateFormat: 'DD/MM/YYYY',
        numberFormat: 'european',
        showDecimals: true,
        compactMode: false
    },

    // Navigation and layout
    sidebar: {
        isOpen: true,
        isCollapsed: false,
        activeSection: 'dashboard'
    },

    // Modals and dialogs
    modal: {
        isOpen: false,
        type: null,
        data: null
    },

    // Toast notifications
    toasts: [],

    // Loading states
    loading: {
        global: false,
        auth: false,
        wallets: false,
        transactions: false,
        files: false,
        sync: false
    },

    // Connection and sync
    isOnline: true,
    lastSync: null,
    syncInProgress: false,

    // Search and filters
    globalSearch: '',
    quickFilters: {
        dateRange: 'month',
        categories: [],
        wallets: [],
        types: []
    },

    // Tutorial and onboarding
    onboarding: {
        completed: false,
        currentStep: 0,
        skipped: false
    },

    // Feature flags
    features: {
        betaFeatures: false,
        advancedAnalytics: false,
        apiIntegrations: false,
        collaborativeFeatures: true
    },

    // Error handling
    errors: []
};

// Slice
const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Theme and appearance
        setTheme: (state, action: PayloadAction<ThemeMode>) => {
            state.theme = action.payload;
        },
        setLanguage: (state, action: PayloadAction<Language>) => {
            state.language = action.payload;
        },
        setCurrency: (state, action: PayloadAction<Currency>) => {
            state.currency = action.payload;
        },

        // Notifications
        updateNotifications: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
            state.notifications = { ...state.notifications, ...action.payload };
        },

        // View preferences
        updateViewPreferences: (state, action: PayloadAction<Partial<ViewPreferences>>) => {
            state.viewPreferences = { ...state.viewPreferences, ...action.payload };
        },

        // Sidebar
        toggleSidebar: (state) => {
            state.sidebar.isOpen = !state.sidebar.isOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.sidebar.isOpen = action.payload;
        },
        toggleSidebarCollapsed: (state) => {
            state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.sidebar.isCollapsed = action.payload;
        },
        setActiveSection: (state, action: PayloadAction<string>) => {
            state.sidebar.activeSection = action.payload;
        },

        // Modal
        openModal: (state, action: PayloadAction<{ type: ModalState['type']; data?: any }>) => {
            state.modal = {
                isOpen: true,
                type: action.payload.type,
                data: action.payload.data
            };
        },
        closeModal: (state) => {
            state.modal = {
                isOpen: false,
                type: null,
                data: null
            };
        },

        // Toast notifications
        addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
            const toast: Toast = {
                id: Date.now().toString(),
                ...action.payload
            };
            state.toasts.push(toast);
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
        clearToasts: (state) => {
            state.toasts = [];
        },

        // Loading states
        setLoading: (state, action: PayloadAction<{ key: keyof LoadingState; value: boolean }>) => {
            state.loading[action.payload.key] = action.payload.value;
        },
        setGlobalLoading: (state, action: PayloadAction<boolean>) => {
            state.loading.global = action.payload;
        },

        // Connection and sync
        setOnlineStatus: (state, action: PayloadAction<boolean>) => {
            state.isOnline = action.payload;
        },
        setSyncInProgress: (state, action: PayloadAction<boolean>) => {
            state.syncInProgress = action.payload;
        },
        updateLastSync: (state) => {
            state.lastSync = new Date().toISOString();
        },

        // Search and filters
        setGlobalSearch: (state, action: PayloadAction<string>) => {
            state.globalSearch = action.payload;
        },
        updateQuickFilters: (state, action: PayloadAction<Partial<UIState['quickFilters']>>) => {
            state.quickFilters = { ...state.quickFilters, ...action.payload };
        },
        clearQuickFilters: (state) => {
            state.quickFilters = {
                dateRange: 'month',
                categories: [],
                wallets: [],
                types: []
            };
        },

        // Onboarding
        setOnboardingStep: (state, action: PayloadAction<number>) => {
            state.onboarding.currentStep = action.payload;
        },
        completeOnboarding: (state) => {
            state.onboarding.completed = true;
        },
        skipOnboarding: (state) => {
            state.onboarding.skipped = true;
            state.onboarding.completed = true;
        },
        resetOnboarding: (state) => {
            state.onboarding = {
                completed: false,
                currentStep: 0,
                skipped: false
            };
        },

        // Feature flags
        updateFeatures: (state, action: PayloadAction<Partial<UIState['features']>>) => {
            state.features = { ...state.features, ...action.payload };
        },

        // Error handling
        addError: (state, action: PayloadAction<Omit<UIState['errors'][0], 'id' | 'timestamp'>>) => {
            const error = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                ...action.payload
            };
            state.errors.push(error);

            // Keep only last 10 errors
            if (state.errors.length > 10) {
                state.errors = state.errors.slice(-10);
            }
        },
        removeError: (state, action: PayloadAction<string>) => {
            state.errors = state.errors.filter((error) => error.id !== action.payload);
        },
        clearErrors: (state) => {
            state.errors = [];
        },

        // Reset UI state
        resetUIState: (state) => {
            // Reset everything except user preferences
            const preservedState = {
                theme: state.theme,
                language: state.language,
                currency: state.currency,
                notifications: state.notifications,
                viewPreferences: state.viewPreferences,
                onboarding: state.onboarding,
                features: state.features
            };

            Object.assign(state, initialState, preservedState);
        }
    }
});

// Selectors
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectLanguage = (state: { ui: UIState }) => state.ui.language;
export const selectCurrency = (state: { ui: UIState }) => state.ui.currency;
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectViewPreferences = (state: { ui: UIState }) => state.ui.viewPreferences;
export const selectSidebar = (state: { ui: UIState }) => state.ui.sidebar;
export const selectModal = (state: { ui: UIState }) => state.ui.modal;
export const selectToasts = (state: { ui: UIState }) => state.ui.toasts;
export const selectLoading = (state: { ui: UIState }) => state.ui.loading;
export const selectIsOnline = (state: { ui: UIState }) => state.ui.isOnline;
export const selectSyncStatus = (state: { ui: UIState }) => ({
    inProgress: state.ui.syncInProgress,
    lastSync: state.ui.lastSync
});
export const selectGlobalSearch = (state: { ui: UIState }) => state.ui.globalSearch;
export const selectQuickFilters = (state: { ui: UIState }) => state.ui.quickFilters;
export const selectOnboarding = (state: { ui: UIState }) => state.ui.onboarding;
export const selectFeatures = (state: { ui: UIState }) => state.ui.features;
export const selectErrors = (state: { ui: UIState }) => state.ui.errors;

// Complex selectors
export const selectIsLoading = (state: { ui: UIState }) => Object.values(state.ui.loading).some((loading) => loading);

export const selectActiveToasts = (state: { ui: UIState }) =>
    state.ui.toasts.filter((toast) => {
        if (!toast.duration) return true;
        const now = Date.now();
        const toastTime = parseInt(toast.id);
        return now - toastTime < toast.duration;
    });

export const selectHasRecentErrors = (state: { ui: UIState }) => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return state.ui.errors.some((error) => new Date(error.timestamp).getTime() > oneHourAgo);
};

export const {
    // Theme and appearance
    setTheme,
    setLanguage,
    setCurrency,

    // Notifications
    updateNotifications,

    // View preferences
    updateViewPreferences,

    // Sidebar
    toggleSidebar,
    setSidebarOpen,
    toggleSidebarCollapsed,
    setSidebarCollapsed,
    setActiveSection,

    // Modal
    openModal,
    closeModal,

    // Toast notifications
    addToast,
    removeToast,
    clearToasts,

    // Loading states
    setLoading,
    setGlobalLoading,

    // Connection and sync
    setOnlineStatus,
    setSyncInProgress,
    updateLastSync,

    // Search and filters
    setGlobalSearch,
    updateQuickFilters,
    clearQuickFilters,

    // Onboarding
    setOnboardingStep,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding,

    // Feature flags
    updateFeatures,

    // Error handling
    addError,
    removeError,
    clearErrors,

    // Reset
    resetUIState
} = uiSlice.actions;

export default uiSlice.reducer;
