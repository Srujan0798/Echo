
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Match, MatchContextType, DiscoveryProfile } from '../types';
import { useAuth } from '../hooks/useAuth';
import { getMatches, saveMatches } from '../utils/localStorage';

const MatchContext = createContext<(MatchContextType & { isLoading: boolean }) | undefined>(undefined);

export const MatchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshMatchesFromStorage = useCallback(() => {
    if (user) {
        setIsLoading(true);
        // Simulate network delay for a better UX
        setTimeout(() => {
            const storedMatches = getMatches(user.id);
            setMatches(storedMatches);
            setIsLoading(false);
        }, 800);
    }
  }, [user]);

  useEffect(() => {
    refreshMatchesFromStorage();

    window.addEventListener('storageUpdated', refreshMatchesFromStorage);
    return () => {
        window.removeEventListener('storageUpdated', refreshMatchesFromStorage);
    };
  }, [user, refreshMatchesFromStorage]);


  useEffect(() => {
    if (user && !isLoading) { // Ensure this runs after initial load
      const currentMatches = getMatches(user.id);
      
      const hasNewMatch = currentMatches.find(m => m.status === 'NEW_MATCH');
      if (hasNewMatch) {
          const matchToUpdate = hasNewMatch;
          const updatedMatch = {
            ...matchToUpdate,
            status: 'QUESTION_RECEIVED' as const,
            customQuestion: {
              askedBy: matchToUpdate.id,
              questionAudio: 'recorded' as const,
              questionTimestamp: Date.now() - 10000,
            }
          };
          const otherMatches = currentMatches.filter(m => m.id !== hasNewMatch.id);
          saveMatches(user.id, [...otherMatches, updatedMatch]);
          refreshMatchesFromStorage();
      }
    }
  }, [user, isLoading, refreshMatchesFromStorage]);

  const persistMatches = useCallback((updatedMatches: Match[]) => {
    if (user) {
      saveMatches(user.id, updatedMatches);
    }
  }, [user]);

  const addMatch = useCallback((profile: DiscoveryProfile, options?: { status?: Match['status'], customQuestion?: Match['customQuestion'] }) => {
    setMatches(prevMatches => {
      if (prevMatches.find(m => m.id === profile.id)) {
        return prevMatches;
      }
      const newMatch: Match = {
        id: profile.id,
        profile,
        status: options?.status || 'NEW_MATCH',
        timestamp: Date.now(),
        customQuestion: options?.customQuestion,
      };
      const updatedMatches = [...prevMatches, newMatch];
      persistMatches(updatedMatches);
      return updatedMatches;
    });
  }, [persistMatches]);

  const updateMatch = useCallback((matchId: string, updates: Partial<Omit<Match, 'id' | 'profile'>>) => {
    setMatches(prevMatches => {
      const updatedMatches = prevMatches.map(m =>
        m.id === matchId ? { ...m, ...updates, timestamp: Date.now() } : m
      );
      persistMatches(updatedMatches);
      return updatedMatches;
    });
  }, [persistMatches]);
  
  const removeMatch = useCallback((matchId: string) => {
    setMatches(prevMatches => {
        const updatedMatches = prevMatches.filter(m => m.id !== matchId);
        persistMatches(updatedMatches);
        return updatedMatches;
    });
  }, [persistMatches]);

  return (
    <MatchContext.Provider value={{ matches, addMatch, updateMatch, removeMatch, isLoading }}>
      {children}
    </MatchContext.Provider>
  );
};

export default MatchContext;
