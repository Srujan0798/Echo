import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthContextType, Profile } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: '12345',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://picsum.photos/100',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isProfileComplete, setIsProfileComplete] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('echo-user');
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        // Check if a profile exists for this user
        const storedProfile = localStorage.getItem(`echo-profile-${parsedUser.id}`);
        if (storedProfile) {
          setIsProfileComplete(true);
        }
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage', err);
      localStorage.removeItem('echo-user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
      setUser(MOCK_USER);
      localStorage.setItem('echo-user', JSON.stringify(MOCK_USER));
      // Check for existing profile upon login
      const storedProfile = localStorage.getItem(`echo-profile-${MOCK_USER.id}`);
      if (storedProfile) {
        setIsProfileComplete(true);
      } else {
        setIsProfileComplete(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(message);
      console.error('Login failed:', message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsProfileComplete(false);
    // Keep profile data in case user logs back in, but clear session user.
    localStorage.removeItem('echo-user');
  }, []);
  
  const completeOnboarding = useCallback((profile: Profile) => {
    if (user) {
      try {
        // We can't store Blobs in JSON, so we'll just store a marker for completion
        const profileToStore = {
            ...profile,
            vibeHook: 'recorded',
            voicePrompts: profile.voicePrompts.map(p => ({...p, answer: 'recorded'}))
        };
        localStorage.setItem(`echo-profile-${user.id}`, JSON.stringify(profileToStore));
        setIsProfileComplete(true);
      } catch (err) {
        console.error("Failed to save profile to localStorage", err);
      }
    }
  }, [user]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    isProfileComplete,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
