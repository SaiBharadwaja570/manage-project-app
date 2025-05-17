import { create } from 'zustand';
import { 
  signInWithRedirect, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getRedirectResult
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { User } from '../types';
import { api } from '../api';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  error: null,
  
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      await signInWithRedirect(auth, googleProvider);

      // After redirect, retrieve the result
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const userData = {
          id: result.user.uid,
          name: result.user.displayName || 'User',
          email: result.user.email || '',
          photoURL: result.user.photoURL || undefined
        };

        await api.post('/auth/login', userData);
        set({ user: userData, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
      set({ error: 'Failed to sign in with Google', loading: false });
    }
  },
  
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: 'Failed to sign out' });
    }
  },
  
  initialize: () => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        // Check if user has just returned from redirect
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const userData = {
            id: result.user.uid,
            name: result.user.displayName || 'User',
            email: result.user.email || '',
            photoURL: result.user.photoURL || undefined
          };
  
          const response = await api.post('/auth/login', userData);
          
          // Optional: store token if returned
          if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
          }
  
          set({ user: userData, loading: false });
          return;
        }
  
        // If already signed in
        if (firebaseUser) {
          const userData = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            photoURL: firebaseUser.photoURL || undefined
          };
  
          const response = await api.post('/auth/verify', { userId: userData.id });
  
          if (response.data?.token) {
            localStorage.setItem('token', response.data.token);
          }
  
          set({ user: userData, loading: false });
        } else {
          set({ user: null, loading: false });
        }
      } catch (error) {
        console.error('Auth init error:', error);
        set({ user: null, loading: false });
      }
    });
  
    return unsubscribe;
  }
  
}));