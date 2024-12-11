import 'react-native-url-polyfill/auto';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ejrdbduxshcpvmgcmcuy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqcmRiZHV4c2hjcHZtZ2NtY3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyNTc3NjcsImV4cCI6MjA0NzgzMzc2N30.OCiYzt_di-W97pxdnEVTmOlLT2xjm7CwiOpWFPCnyC8';

// Custom storage implementation
const customStorage = {
    getItem: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            console.log(`[Supabase Storage] Getting ${key}:`, value);
            return value;
        } catch (error) {
            console.error(`[Supabase Storage] Error getting ${key}:`, error);
            return null;
        }
    },
    setItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, value);
            console.log(`[Supabase Storage] Setting ${key}:`, value);
        } catch (error) {
            console.error(`[Supabase Storage] Error setting ${key}:`, error);
        }
    },
    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`[Supabase Storage] Removing ${key}`);
        } catch (error) {
            console.error(`[Supabase Storage] Error removing ${key}:`, error);
        }
    }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: customStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
});

// Authentication functions
export const signUpWithEmail = async (email, password, name) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const signInWithEmail = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        // Explicitly store the token if login is successful
        if (data.session) {
            await AsyncStorage.setItem('token', data.session.access_token);
        }
        
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        // Clear the token from AsyncStorage
        await AsyncStorage.removeItem('token');
        return { error };
    } catch (error) {
        return { error };
    }
};

export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        return { user, error };
    } catch (error) {
        return { user: null, error };
    }
};

export const resetPassword = async (email) => {
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email);
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};

export const updatePassword = async (newPassword) => {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        return { data, error };
    } catch (error) {
        return { data: null, error };
    }
};
