
import { useContext } from 'react';
import MatchContext from '../contexts/MatchContext';
import { MatchContextType } from '../types';

export const useMatches = (): MatchContextType & { isLoading: boolean } => {
  const context = useContext(MatchContext);
  if (context === undefined) {
    throw new Error('useMatches must be used within a MatchProvider');
  }
  return context;
};
