import React from 'react';
import { DiscoveryProfile, User } from '../../types';
import Button from '../Button';
import { Heart } from '../icons';

interface MatchModalProps {
  isOpen: boolean;
  currentUser: User | null;
  matchedProfile: DiscoveryProfile | null;
  onClose: () => void;
  onRequestCall: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ isOpen, currentUser, matchedProfile, onClose, onRequestCall }) => {
  if (!isOpen || !matchedProfile || !currentUser) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'sans-serif', textShadow: '0 0 15px #FF6B6B' }}>
          It's a Match!
        </h1>
        <p className="text-lg text-gray-300 mb-8">You and {matchedProfile.name} have liked each other.</p>
      </div>

      <div className="relative flex items-center justify-center mb-10">
        <div className={`w-32 h-32 rounded-full ${matchedProfile.vibeGraphic} border-4 border-white shadow-lg transform -rotate-12`}></div>
        <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-white shadow-lg transform rotate-12 -ml-8 flex items-center justify-center">
            <img src={currentUser.avatarUrl} alt="Your avatar" className="w-full h-full object-cover rounded-full" />
        </div>
        <Heart size={40} className="absolute text-[#FF6B6B] -top-2" fill="#FF6B6B"/>
      </div>
      
      <div className="w-full max-w-xs space-y-3">
        <Button onClick={onRequestCall}>Request ECHO Call</Button>
        <Button onClick={onClose} variant="secondary">Keep Exploring</Button>
      </div>
    </div>
  );
};

export default MatchModal;
