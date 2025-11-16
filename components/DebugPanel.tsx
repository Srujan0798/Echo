import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMatches } from '../hooks/useMatches';
import { getMatches, saveMatches } from '../utils/localStorage';
import { simulatePartnerReadyToReveal } from '../utils/mockBehaviors';
import { mockProfiles } from '../data/mockProfiles';
import { Match } from '../types';

const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { matches, addMatch, updateMatch } = useMatches();

  if (!user) return null;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to delete all app data?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleForceReveal = () => {
    console.log('Forcing reveal for all waiting matches...');
    const allMatches = getMatches(user.id);
    allMatches.forEach(match => {
      if (match.revealStatus && match.revealStatus.softRevealUnlockedAt && !match.revealStatus.fullRevealAt) {
        if (!match.revealStatus.userReadyAt) {
          match.revealStatus.userReadyAt = Date.now() - 1000;
        }
        if (!match.revealStatus.theirReadyAt) {
          simulatePartnerReadyToReveal(match.id, user.id, 500);
        }
      }
    });
  };
  
  const handleSkipTimer = () => {
     // This needs access to the current chat's matchId. 
     // For now, let's find the first match with a timer.
     const matchWithTimer = matches.find(m => m.revealStatus && m.revealStatus.softRevealUnlockedAt && m.revealStatus.softRevealUnlockedAt > Date.now());
     if (matchWithTimer) {
        updateMatch(matchWithTimer.id, {
            revealStatus: { ...matchWithTimer.revealStatus, softRevealUnlockedAt: Date.now() - 1000 }
        });
        alert(`Skipped timer for ${matchWithTimer.profile.name}`);
     } else {
        alert("No active reveal timers found.");
     }
  };

  const handleGenerateMatches = () => {
    const existingMatchIds = matches.map(m => m.id);
    const newProfiles = mockProfiles
        .filter(p => !existingMatchIds.includes(p.id))
        .slice(0, 5);
    
    if (newProfiles.length === 0) {
        alert("No new profiles to generate matches from.");
        return;
    }

    newProfiles.forEach((profile, index) => {
        setTimeout(() => {
            const newMatch: Match = {
                id: profile.id,
                profile,
                status: 'NEW_MATCH',
                timestamp: Date.now(),
            };
            addMatch(profile);
        }, index * 200);
    });
    alert(`Generated ${newProfiles.length} new matches.`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-[#FF6B6B] text-white p-3 rounded-full shadow-lg z-50"
      >
        DEV
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)}>
      <div 
        className="fixed bottom-0 left-0 right-0 bg-[#282828] p-4 rounded-t-lg shadow-lg z-50 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg text-center mb-4">🛠️ Debug Panel 🛠️</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
            <button onClick={handleGenerateMatches} className="bg-sky-600 p-2 rounded">Generate 5 Matches</button>
            <button onClick={handleForceReveal} className="bg-purple-600 p-2 rounded">Force Reveal All</button>
            <button onClick={handleSkipTimer} className="bg-green-600 p-2 rounded">Skip Reveal Timer</button>
            <button onClick={handleReset} className="bg-red-600 p-2 rounded">Reset All Data</button>
        </div>
        <button onClick={() => setIsOpen(false)} className="w-full mt-4 text-xs text-gray-400">Close</button>
      </div>
    </div>
  );
};

export default DebugPanel;
