
import React, { createContext, useState, ReactNode } from 'react';
import { Profile, OnboardingContextType } from '../types';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

const initialProfile: Profile = {
  name: '',
  age: 18,
  gender: '',
  lookingFor: '',
  vibeGraphic: 'bg-gradient-to-br from-pink-500 to-yellow-500',
  vibeHook: null,
  voicePrompts: [],
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const updateProfile = (updates: Partial<Profile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const value = {
    profile,
    updateProfile,
    currentStep,
    setCurrentStep,
    totalSteps,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

export default OnboardingContext;