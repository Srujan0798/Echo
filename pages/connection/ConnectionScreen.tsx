import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Match } from '../../types';
import { PhoneOff, MicOff, Volume2 } from '../../components/icons';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';

const ConnectionScreen: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useAuth();
  const match: Match | undefined = state?.match;
  
  const CALL_DURATION_SECONDS = 5 * 60; // 5 minutes
  const [timeLeft, setTimeLeft] = useState(CALL_DURATION_SECONDS);

  useEffect(() => {
    if (!match) {
      navigate('/matches'); // Redirect if no match data is passed
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEndCall();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [match, navigate]);
  
  const handleEndCall = () => {
    if (user && match) {
      const storedMatches: Match[] = JSON.parse(localStorage.getItem(`echo-matches-${user.id}`) || '[]');
      const updatedMatches = storedMatches.map(m => 
        m.id === match.id 
        ? {...m, status: 'CHAT_ACTIVE', timestamp: Date.now(), chatStartedTimestamp: Date.now() }
        : m
      );
      localStorage.setItem(`echo-matches-${user.id}`, JSON.stringify(updatedMatches));
    }
    navigate('/matches');
  };
  
  if (!match) return null; // Render nothing while redirecting

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
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
          <Button onClick={handleEndCall} className="!w-auto !p-5 !rounded-full !bg-red-600">
             <PhoneOff size={32} />
          </Button>
          <button className="bg-white/10 p-4 rounded-full text-white"><Volume2 size={24} /></button>
      </div>
    </div>
  );
};

export default ConnectionScreen;