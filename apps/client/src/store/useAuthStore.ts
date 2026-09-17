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

const CACHED_USER_KEY = 'zync_cached_user';

function getInitialCachedUser(): UserDto | null {
  try {
    const raw = localStorage.getItem(CACHED_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedUser(user: UserDto | null) {
  try {
    if (user) {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CACHED_USER_KEY);
    }
  } catch {
    // ignore
  }
}

const initialUser = getInitialCachedUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: null,
  isAuthenticated: !!initialUser,
  isLoading: !initialUser,
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
      setCachedUser(user);
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
      setCachedUser(user);
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
      setCachedUser(null);
      setApiAccessToken(null);
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  checkAuth: async () => {
    // If no cached user is present, indicate loading state
    if (!initialUser) {
      set({ isLoading: true });
    }

    try {
      const res = await apiRequest('/api/auth/refresh', { method: 'POST' });
      if (res.success && res.data?.accessToken) {
        setApiAccessToken(res.data.accessToken);
        setCachedUser(res.data.user);
        set({
          user: res.data.user,
          accessToken: res.data.accessToken,
          isAuthenticated: true,
          isLoading: false
        });
        return;
      }
    } catch {
      // Session expired or unauthenticated
    }

    // If verification failed, clear cache and reset
    setCachedUser(null);
    setApiAccessToken(null);
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },

  setUser: (user: UserDto) => {
    setCachedUser(user);
    set({ user });
  }
}));
