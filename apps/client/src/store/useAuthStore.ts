import { create } from 'zustand';
import { UserDto } from '@zync/shared';
import { apiRequest, setApiAccessToken } from '../lib/api';

interface AuthState {
  user: UserDto | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    username: string;
    email: string;
    dob: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) => Promise<{ email: string }>;
  verifyOtp: (email: string, otp: string) => Promise<void>;
  resendOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: UserDto) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  clearError: () => set({ error: null }),

  login: async (identifier: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiRequest('/api/auth/login', {
        method: 'POST',
        data: { identifier, password }
      });
      const { user, accessToken } = res.data;
      setApiAccessToken(accessToken);
      set({ user, accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Login failed', isLoading: false });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiRequest('/api/auth/register', {
        method: 'POST',
        data
      });
      set({ isLoading: false });
      return { email: res.data.email };
    } catch (err: any) {
      set({ error: err.message || 'Registration failed', isLoading: false });
      throw err;
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    set({ isLoading: true, error: null });
    try {
      const res = await apiRequest('/api/auth/verify-otp', {
        method: 'POST',
        data: { email, otp }
      });
      const { user, accessToken } = res.data;
      setApiAccessToken(accessToken);
      set({ user, accessToken, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Verification failed', isLoading: false });
      throw err;
    }
  },

  resendOtp: async (email: string) => {
    try {
      await apiRequest('/api/auth/resend-otp', {
        method: 'POST',
        data: { email }
      });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  logout: async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      setApiAccessToken(null);
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await apiRequest('/api/auth/refresh', { method: 'POST' });
      if (res.success && res.data?.accessToken) {
        setApiAccessToken(res.data.accessToken);
        set({
          user: res.data.user,
          accessToken: res.data.accessToken,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }
    } catch {
      // Not authenticated or refresh expired
    }
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: UserDto) => set({ user })
}));
