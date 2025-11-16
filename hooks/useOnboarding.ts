
import { useContext } from 'react';
import OnboardingContext from '../contexts/OnboardingContext';
import { OnboardingContextType } from '../types';

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};