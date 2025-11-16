
import { useContext } from 'react';
import DeveloperContext from '../contexts/DeveloperContext';

// Re-export the type if it's not exported from the context file
interface DeveloperContextType {
  isDeveloperMode: boolean;
  skipTimers: boolean;
  setSkipTimers: (skip: boolean) => void;
  currentRole: 'sender' | 'receiver';
  switchRole: () => void;
  showTimerControls: boolean;
  setShowTimerControls: (show: boolean) => void;
}

export const useDeveloper = () => {
  const context = useContext(DeveloperContext);
  if (!context) {
    throw new Error('useDeveloper must be used within a DeveloperProvider');
  }
  return context;
};