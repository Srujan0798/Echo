import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Match } from '../../types';
import { formatDistanceToNow } from '../../utils/time';
import Button from '../Button';

interface MatchCardProps {
  match: Match;
  onUpdateMatchStatus: (matchId: string, newStatus: Match['status']) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onUpdateMatchStatus }) => {
  const navigate = useNavigate();

  const handleAction = () => {
    switch(match.status) {
      case 'NEW_MATCH':
        onUpdateMatchStatus(match.id, 'CALL_REQUESTED_BY_ME');
        break;
      case 'CALL_REQUESTED_BY_THEM':
        // Simulate them also accepting
        setTimeout(() => onUpdateMatchStatus(match.id, 'CALL_ACCEPTED'), 500);
        break;
      case 'CALL_ACCEPTED':
        navigate('/connection', { state: { match } });
        break;
      case 'CHAT_ACTIVE':
        navigate(`/chat/${match.id}`);
        break;
    }
  };

  const getButtonProps = (): { text: string; disabled: boolean, variant: 'primary' | 'secondary' } => {
    switch (match.status) {
      case 'NEW_MATCH':
        return { text: 'Request Call', disabled: false, variant: 'primary' };
      case 'CALL_REQUESTED_BY_ME':
        return { text: 'Request Sent', disabled: true, variant: 'secondary' };
      case 'CALL_REQUESTED_BY_THEM':
        return { text: 'Accept Call', disabled: false, variant: 'primary' };
      case 'CALL_ACCEPTED':
        return { text: 'Start 5-Min Call', disabled: false, variant: 'primary' };
       case 'CHAT_ACTIVE':
        return { text: 'Open Chat', disabled: false, variant: 'secondary' };
      default:
        return { text: '...', disabled: true, variant: 'secondary' };
    }
  };
  
  const { text, disabled, variant } = getButtonProps();

  return (
    <div className="bg-[#282828] rounded-lg p-4 flex flex-col gap-4 animate-fade-in">
        <div className="flex items-center gap-4">
            {match.isRevealed && match.profile.imageUrl ? (
              <img src={match.profile.imageUrl} alt={match.profile.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className={`w-16 h-16 rounded-lg ${match.profile.vibeGraphic} flex-shrink-0`}></div>
            )}
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-white">{match.profile.name}, {match.profile.age}</h3>
                <p className="text-sm text-[#B3B3B3]">Matched {formatDistanceToNow(match.timestamp)}</p>
            </div>
        </div>
        <Button onClick={handleAction} disabled={disabled} variant={variant} className="py-2 text-sm">
            {text}
        </Button>
    </div>
  );
};

export default MatchCard;