import React, { useState, useMemo, useRef, useEffect } from 'react';
import { mockProfiles } from '../../data/mockProfiles';
import ProfileCard from '../../components/discover/ProfileCard';
import FullProfileModal from '../../components/discover/FullProfileModal';
import MatchModal from '../../components/discover/MatchModal';
import { DiscoveryProfile, Match } from '../../types';
import { useAuth } from '../../hooks/useAuth';

const DiscoverScreen: React.FC = () => {
  const { user } = useAuth();
  const [swipedProfiles, setSwipedProfiles] = useState<string[]>(() => {
    const saved = localStorage.getItem(`echo-swiped-${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeProfile, setActiveProfile] = useState<DiscoveryProfile | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<DiscoveryProfile | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  
  const profilesToShow = useMemo(() => {
    return mockProfiles.filter(p => !swipedProfiles.includes(p.id));
  }, [swipedProfiles]);

  const handleSwipe = (profileId: string) => {
    const newSwiped = [...swipedProfiles, profileId];
    setSwipedProfiles(newSwiped);
    localStorage.setItem(`echo-swiped-${user?.id}`, JSON.stringify(newSwiped));
    
    // Auto-scroll to next card
    if (feedRef.current) {
      const currentCard = feedRef.current.querySelector(`[data-profile-id="${profileId}"]`);
      if (currentCard) {
        const nextCard = currentCard.nextElementSibling;
        if (nextCard) {
          nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const handleLike = (profile: DiscoveryProfile) => {
    if (profile.likesYou) {
      setMatchedProfile(profile);
      // Create and save the match
      const currentMatches: Match[] = JSON.parse(localStorage.getItem(`echo-matches-${user?.id}`) || '[]');
      const newMatch: Match = {
        id: profile.id,
        profile: profile,
        status: 'NEW_MATCH',
        timestamp: Date.now(),
      };
      // Avoid duplicate matches
      if (!currentMatches.find(m => m.id === newMatch.id)) {
        localStorage.setItem(`echo-matches-${user?.id}`, JSON.stringify([...currentMatches, newMatch]));
      }
    }
    handleSwipe(profile.id);
  };
  
  const handlePass = (profile: DiscoveryProfile) => {
    handleSwipe(profile.id);
  };

  const handleViewProfile = (profile: DiscoveryProfile) => {
    setActiveProfile(profile);
    setProfileModalOpen(true);
  };
  
  const handleRequestCallFromModal = () => {
    if(matchedProfile && user) {
        const matches: Match[] = JSON.parse(localStorage.getItem(`echo-matches-${user.id}`) || '[]');
        const updatedMatches = matches.map(m => m.id === matchedProfile.id ? {...m, status: 'CALL_REQUESTED_BY_ME'} : m);
        localStorage.setItem(`echo-matches-${user.id}`, JSON.stringify(updatedMatches));
    }
    setMatchedProfile(null);
  };

  return (
    <div ref={feedRef} className="h-full w-full overflow-y-auto snap-y snap-mandatory">
      {profilesToShow.length > 0 ? (
        profilesToShow.map(profile => (
          <div key={profile.id} data-profile-id={profile.id} className="h-full w-full snap-start">
             <ProfileCard 
                profile={profile} 
                onLike={handleLike}
                onPass={handlePass}
                onViewProfile={handleViewProfile}
                onCardDoubleTap={handleViewProfile} // Double tap to view profile
             />
          </div>
        ))
      ) : (
        <div className="h-full w-full flex items-center justify-center text-center p-8">
            <div>
                <h2 className="text-2xl font-bold text-white">That's everyone for now!</h2>
                <p className="text-[#B3B3B3] mt-2">Check back later for new profiles.</p>
            </div>
        </div>
      )}

      <FullProfileModal 
        profile={activeProfile}
        isOpen={isProfileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      <MatchModal 
        isOpen={!!matchedProfile}
        currentUser={user}
        matchedProfile={matchedProfile}
        onClose={() => setMatchedProfile(null)}
        onRequestCall={handleRequestCallFromModal}
      />
    </div>
  );
};

export default DiscoverScreen;
