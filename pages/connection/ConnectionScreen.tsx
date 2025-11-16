
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Match } from '../../types';
import { PhoneOff, MicOff, Volume2 } from '../../components/icons';
import { useMatches } from '../../hooks/useMatches';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import CallCompletionModal from '../../components/connection/CallCompletionModal';
import ConfirmationModal from '../../components/settings/ConfirmationModal';

const ConnectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useLocation();
  const { updateMatch, removeMatch } = useMatches();
  const match: Match | undefined = state?.match;
  
  const CALL_DURATION_SECONDS = 5 * 60; // 5 minutes
  const [timeLeft, setTimeLeft] = useState(CALL_DURATION_SECONDS);
  const [isCompletionModalOpen, setCompletionModalOpen] = useState(false);
  const [isExitModalOpen, setExitModalOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setCompletionModalOpen(true);
  };

  useEffect(() => {
    if (!match) {
      navigate('/matches', { replace: true });
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if(timerRef.current) clearInterval(timerRef.current);
          handleEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Navigation guard
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if(timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, navigate]);
  
  const handleDecision = (decision: 'CONTINUE' | 'NO_CONNECTION') => {
    if (!match) return;
    const ourDecisionUpdate = {
      status: 'CALL_COMPLETED_WAITING' as const,
      callDecision: { ...match.callDecision, userDecision: decision, decidedAt: Date.now() }
    };
    updateMatch(match.id, ourDecisionUpdate);
    setCompletionModalOpen(false);
    navigate('/matches', { replace: true });
    
    setTimeout(() => {
        const theirDecision = Math.random() > 0.3 ? 'CONTINUE' : 'NO_CONNECTION';
        if (decision === 'CONTINUE' && theirDecision === 'CONTINUE') {
            const now = Date.now();
            updateMatch(match.id, {
                status: 'CHAT_ACTIVE',
                chatStartedTimestamp: now,
                revealStatus: {
                  softRevealUnlockedAt: now + 24 * 60 * 60 * 1000,
                },
                callDecision: { ...ourDecisionUpdate.callDecision, theirDecision }
            });
        } else {
            removeMatch(match.id);
        }
    }, 2500);
  };
  
  if (!match) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const DebugPanel = () => (
    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-xs text-white text-center">
      <p className="font-bold mb-1">Debug Panel</p>
      <div className="flex justify-center gap-2">
        <button onClick={() => setTimeLeft(p => Math.max(0, p - 60))} className="bg-gray-600 px-2 py-1 rounded">-1 Min</button>
        <button onClick={handleEndCall} className="bg-red-600 px-2 py-1 rounded">End Call Now</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="animate-fade-in h-full flex flex-col items-center justify-between p-6 bg-[#1a1a1a]">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">In Call with {match.profile.name}</h1>
          <p className="text-4xl font-mono text-[#FF6B6B] mt-4">{formatTime(timeLeft)}</p>
        </div>
        <div className="relative flex items-center justify-center my-8">
          <div className={`w-32 h-32 rounded-full ${match.profile.vibeGraphic} border-4 border-white shadow-lg transform -rotate-12`}></div>
          <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-white shadow-lg transform rotate-12 -ml-8 flex items-center justify-center">
              <img src={user?.avatarUrl} alt="Your avatar" className="w-full h-full object-cover rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-6 w-full max-w-xs">
            <button className="bg-white/10 p-4 rounded-full text-white"><MicOff size={24} /></button>
            <Button onClick={() => setExitModalOpen(true)} className="!w-auto !p-5 !rounded-full !bg-red-600">
              <PhoneOff size={32} />
            </Button>
            <button className="bg-white/10 p-4 rounded-full text-white"><Volume2 size={24} /></button>
        </div>
        <DebugPanel />
      </div>

      <CallCompletionModal 
        isOpen={isCompletionModalOpen}
        onDecision={handleDecision}
      />
      
      <ConfirmationModal
        isOpen={isExitModalOpen}
        onClose={() => setExitModalOpen(false)}
        onConfirm={handleEndCall}
        title="End Call?"
        confirmText="Yes, End Call"
      >
        <p className="text-[#B3B3B3]">Are you sure you want to end your call with {match.profile.name}?</p>
      </ConfirmationModal>
    </>
  );
};

export default ConnectionScreen;
