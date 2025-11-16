import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Match } from '../../types';
import MatchCard from '../../components/matches/MatchCard';
import { Heart } from '../../components/icons';

const MatchesScreen: React.FC = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);

  const loadMatches = useCallback(() => {
    if (user) {
      const storedMatches = localStorage.getItem(`echo-matches-${user.id}`);
      if (storedMatches) {
        setMatches(JSON.parse(storedMatches));
      }
    }
  }, [user]);
  
  useEffect(() => {
    loadMatches();
    // Optional: Add an interval to refresh matches for demo purposes
    const interval = setInterval(loadMatches, 2000); // Check for updates
    return () => clearInterval(interval);
  }, [loadMatches]);
  
  const handleUpdateMatchStatus = (matchId: string, newStatus: Match['status']) => {
    const updatedMatches = matches.map(m => m.id === matchId ? { ...m, status: newStatus, timestamp: Date.now() } : m);
    setMatches(updatedMatches);
    if (user) {
        localStorage.setItem(`echo-matches-${user.id}`, JSON.stringify(updatedMatches));
    }
  };

  return (
    <div className="p-4 animate-fade-in h-full">
      <h1 className="text-3xl font-bold text-white mb-6">Your Matches</h1>
      
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matches.sort((a,b) => b.timestamp - a.timestamp).map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onUpdateMatchStatus={handleUpdateMatchStatus}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center text-[#B3B3B3]">
          <Heart size={48} className="mb-4" />
          <h2 className="text-xl font-semibold text-white">No matches yet.</h2>
          <p>When you and another person like each other, they'll appear here.</p>
        </div>
      )}
    </div>
  );
};

export default MatchesScreen;
