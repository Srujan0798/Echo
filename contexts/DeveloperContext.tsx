
import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface DeveloperContextType {
  isDeveloperMode: boolean;
  skipTimers: boolean;
  setSkipTimers: (skip: boolean) => void;
  currentRole: 'sender' | 'receiver';
  switchRole: () => void;
  showTimerControls: boolean;
  setShowTimerControls: (show: boolean) => void;
}

const DeveloperContext = createContext<DeveloperContextType | undefined>(undefined);

export const DeveloperProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [skipTimers, setSkipTimers] = useState(false);
  const [currentRole, setCurrentRole] = useState<'sender' | 'receiver'>('sender');
  const [showTimerControls, setShowTimerControls] = useState(true);

  useEffect(() => {
    const mode = localStorage.getItem('echo-app-mode');
    const devMode = mode === 'developer';
    setIsDeveloperMode(devMode);
    setSkipTimers(devMode); // Default to skip timers in dev mode
  }, []);

  const switchRole = () => {
    setCurrentRole(prev => prev === 'sender' ? 'receiver' : 'sender');
  };

  return (
    <DeveloperContext.Provider value={{
      isDeveloperMode,
      skipTimers,
      setSkipTimers,
      currentRole,
      switchRole,
      showTimerControls,
      setShowTimerControls,
    }}>
      {children}
    </DeveloperContext.Provider>
  );
};

export default DeveloperContext;