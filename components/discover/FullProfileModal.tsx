
import React from 'react';
import { DiscoveryProfile } from '../../types';
import { X } from '../icons';
import PromptPlayer from './PromptPlayer';

interface FullProfileModalProps {
  profile: DiscoveryProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

const FullProfileModal: React.FC<FullProfileModalProps> = ({ profile, isOpen, onClose }) => {
  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fadeIn" onClick={onClose}>
      <div 
        className="bg-[#1a1a1a] w-full max-w-md max-h-[85vh] rounded-t-2xl flex flex-col animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative w-full h-40 rounded-t-2xl ${profile.vibeGraphic} flex flex-col justify-end p-4 shadow-lg`}>
          <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/40 rounded-full p-2 z-10" aria-label="Close profile view"><X size={24} /></button>
          <h2 className="text-3xl font-bold text-white drop-shadow-md">{profile.name}, {profile.age}</h2>
          <p className="text-md text-gray-200 drop-shadow-sm">{profile.distance} miles away</p>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="font-bold text-white mb-2 text-lg">VibeHook</h3>
            <PromptPlayer prompt="Their 15-second intro" isVibeHook />
          </div>

          {profile.prompts && profile.prompts.length > 0 && (
            <div>
                <h3 className="font-bold text-white mb-2 text-lg">Prompts</h3>
                <div className="space-y-3">
                {profile.prompts.map((p, index) => (
                    <PromptPlayer key={index} prompt={p.question} answerText={p.answerText} />
                ))}
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FullProfileModal;