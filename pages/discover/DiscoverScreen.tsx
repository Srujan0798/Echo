
import React, { useState, useMemo, useRef } from 'react';
import { mockProfiles } from '../../data/mockProfiles';
import ProfileCard from '../../components/discover/ProfileCard';
import FullProfileModal from '../../components/discover/FullProfileModal';
import MatchModal from '../../components/discover/MatchModal';
import { DiscoveryProfile } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useMatches } from '../../hooks/useMatches';
import CustomQuestionModal from '../../components/matches/CustomQuestionModal';
import EmptyState from '../../components/common/EmptyState';
import { Home } from '../../components/icons';

const DiscoverScreen: React.FC = () => {
  const { user } = useAuth();
  const { addMatch } = useMatches();

  const [swipedProfiles, setSwipedProfiles] = useState<string[]>(() => {
    const saved = localStorage.getItem(`echo-swiped-${user?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeProfile, setActiveProfile] = useState<DiscoveryProfile | null>(null);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<DiscoveryProfile | null>(null);
  const [isQuestionModalOpen, setQuestionModalOpen] = useState(false);

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
  
  const handleSendQuestion = (questionAudio: Blob) => {
    if(activeProfile && user) {
        addMatch(activeProfile, {
            status: 'QUESTION_SENT_BY_ME',
            customQuestion: {
                askedBy: user.id,
                questionAudio,
                questionTimestamp: Date.now(),
            }
        });
    }
    setQuestionModalOpen(false);
    setActiveProfile(null);
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
        <div className="h-full w-full flex items-center justify-center snap-start">
            <EmptyState
                icon={<Home size={48} />}
                title="That's everyone for now!"
                description="Check back later for new profiles or adjust your preferences."
            />
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
        onInitiateConnection={() => {
            setActiveProfile(matchedProfile); // Set profile to ask question to
            setMatchedProfile(null);
            setQuestionModalOpen(true);
        }}
      />
      
      <CustomQuestionModal
        isOpen={isQuestionModalOpen}
        profile={activeProfile}
        onClose={() => {
            setQuestionModalOpen(false);
            setActiveProfile(null);
            setMatchedProfile(null);
        }}
        onSend={handleSendQuestion}
      />
    </div>
  );
};

export default DiscoverScreen;