import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../../types';
import { Info } from '../icons';
import Button from '../Button';
import { RevealStatusInfo } from '../../utils/reveal';

interface ChatHeaderProps {
  match: Match;
  revealStatus: RevealStatusInfo | null;
  onReadyClick: () => void;
  onEndConnectionClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ match, revealStatus, onReadyClick, onEndConnectionClick }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const getStatus = () => {
    if (!revealStatus) return { text: 'Loading...', color: 'text-gray-400' };
    switch(revealStatus.phase) {
        case 'FULLY_REVEALED': return { text: 'Revealed', color: 'text-green-400' };
        case 'WAITING_FOR_PARTNER': return { text: 'Waiting for them...', color: 'text-gray-400' };
        case 'WAITING_FOR_YOU': return { text: `${match.profile.name} is ready!`, color: 'text-yellow-400' };
        case 'SOFT_AVAILABLE': return { text: 'Soft Reveal Active', color: 'text-gray-400' };
        case 'COUNTDOWN': return { text: 'Voice & Text Only', color: 'text-gray-400' };
        case 'LOCKED': 
        default: return { text: 'Voice & Text Only', color: 'text-gray-400' };
    }
  };

  const status = getStatus();

  return (
    <header className="bg-[#282828] flex items-center p-3 shadow-md sticky top-0 z-20">
      <button onClick={() => navigate(-1)} className="text-white p-2 rounded-full hover:bg-white/10" aria-label="Back to matches">&lt;</button>
      
      {revealStatus?.isFullyRevealed ? (
          <img src={match.profile.imageUrl} alt={match.profile.name} className="w-10 h-10 rounded-full ml-2 object-cover" />
      ) : (
          <div className={`w-10 h-10 rounded-full ml-2 ${match.profile.vibeGraphic}`}></div>
      )}
      
      <div className="ml-3 flex-grow">
        <h2 className="font-bold text-white">{match.profile.name}</h2>
        <p className={`text-xs ${status.color}`}>{status.text}</p>
      </div>
      
      {revealStatus?.canInitiateFullReveal && (
        <Button onClick={onReadyClick} className="!w-auto !py-1.5 px-3 text-sm mr-2">
          Ready to Reveal
        </Button>
      )}

      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-white p-2 rounded-full hover:bg-white/10" aria-label="More options">
          <Info size={24} />
        </button>
        {menuOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a] rounded-lg shadow-lg z-30 animate-fadeIn py-1">
            {revealStatus?.isFullyRevealed && (
              <button 
                onClick={() => {
                  onEndConnectionClick();
                  setMenuOpen(false);
                }} 
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10"
              >
                End Connection
              </button>
            )}
            <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white/10">Report</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;