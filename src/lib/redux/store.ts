import { combineReducers, configureStore } from '@reduxjs/toolkit';

// Import slices
import authSlice from './slices/authSlice';
import transactionsSlice from './slices/transactionsSlice';
import uiSlice from './slices/uiSlice';
import walletsSlice from './slices/walletsSlice';
// Typed hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persist config
const persistConfig = {
    key: 'fima-root',
    storage,
    whitelist: ['auth', 'ui'], // Only persist auth and ui state
    blacklist: ['wallets', 'transactions'] // Don't persist data that should be fetched fresh
};

// Root reducer
const rootReducer = combineReducers({
    auth: authSlice,
    wallets: walletsSlice,
    transactions: transactionsSlice,
    ui: uiSlice
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
                ignoredPaths: ['register']
            }
        }),
    devTools: process.env.NODE_ENV !== 'production'
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
