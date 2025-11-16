
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Match, MatchStatus } from '../../types';
import { formatDistanceToNow } from '../../utils/time';
import Button from '../Button';
import QnAReviewCard from './QnAReviewCard';
import { useMatches } from '../../hooks/useMatches';

interface MatchCardProps {
  match: Match;
  onAnswerQuestion: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onAnswerQuestion }) => {
  const navigate = useNavigate();
  const { updateMatch } = useMatches();

  const handleAction = () => {
    switch(match.status) {
      case 'QUESTION_RECEIVED':
        onAnswerQuestion();
        break;
      case 'CALL_READY':
        updateMatch(match.id, { status: 'IN_CALL' });
        navigate('/connection', { state: { match } });
        break;
      case 'CHAT_ACTIVE':
        navigate(`/chat/${match.id}`);
        break;
      // Note: 'NEW_MATCH' and 'QUESTION_SENT_BY_ME' are handled by getButtonProps disabling/changing text
    }
  };

  const getButtonProps = (): { text: string; disabled: boolean, variant: 'primary' | 'secondary' } => {
    switch (match.status) {
      case 'NEW_MATCH':
        // This state should transition to the question flow, but for now it's a placeholder
        // In a real app, clicking this would open the CustomQuestionModal
        return { text: 'Ask a Question', disabled: true, variant: 'primary' };
      case 'QUESTION_SENT_BY_ME':
        return { text: 'Question Sent', disabled: true, variant: 'secondary' };
      case 'QUESTION_RECEIVED':
        return { text: 'Answer Their Question', disabled: false, variant: 'primary' };
      case 'QNA_COMPLETE':
        return { text: 'Ready for Call!', disabled: true, variant: 'secondary' };
      case 'CALL_READY':
        return { text: 'Start 5-Min Call', disabled: false, variant: 'primary' };
      case 'CALL_COMPLETED_WAITING':
        return { text: 'Waiting for decision...', disabled: true, variant: 'secondary' };
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
            {match.revealStatus?.fullRevealAt && match.profile.imageUrl ? (
              <img src={match.profile.imageUrl} alt={match.profile.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className={`w-16 h-16 rounded-lg ${match.profile.vibeGraphic} flex-shrink-0`}></div>
            )}
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-white">{match.profile.name}, {match.profile.age}</h3>
                <p className="text-sm text-[#B3B3B3]">Matched {formatDistanceToNow(match.timestamp)}</p>
            </div>
        </div>
        
        {(match.status === 'QNA_COMPLETE' || match.status === 'CALL_READY') && match.customQuestion && (
            <QnAReviewCard customQuestion={match.customQuestion} profileName={match.profile.name} />
        )}
        
        <Button onClick={handleAction} disabled={disabled} variant={variant} className="py-2 text-sm">
            {text}
        </Button>
    </div>
  );
};

export default MatchCard;