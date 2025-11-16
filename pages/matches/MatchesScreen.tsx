
import React, { useState } from 'react';
import { useMatches } from '../../hooks/useMatches';
import MatchCard from '../../components/matches/MatchCard';
import { Heart } from '../../components/icons';
import { Match } from '../../types';
import AnswerQuestionModal from '../../components/matches/AnswerQuestionModal';
import MatchCardSkeleton from '../../components/skeletons/MatchCardSkeleton';
import EmptyState from '../../components/common/EmptyState';

const MatchesScreen: React.FC = () => {
  const { matches, updateMatch, isLoading } = useMatches();
  const [matchToAnswer, setMatchToAnswer] = useState<Match | null>(null);

  const handleSendAnswer = (answerAudio: Blob) => {
    if (!matchToAnswer) return;

    const updatedQuestion = { ...matchToAnswer.customQuestion, answerAudio, answerTimestamp: Date.now() };
    updateMatch(matchToAnswer.id, { customQuestion: updatedQuestion, status: 'QNA_COMPLETE' });
    
    setTimeout(() => {
        updateMatch(matchToAnswer.id, { status: 'CALL_READY' });
    }, 1500);

    setMatchToAnswer(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <MatchCardSkeleton key={i} />)}
        </div>
      );
    }
    
    if (matches.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matches.sort((a,b) => b.timestamp - a.timestamp).map(match => (
            <MatchCard 
              key={match.id} 
              match={match} 
              onAnswerQuestion={() => setMatchToAnswer(match)}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <EmptyState 
            icon={<Heart size={48} />}
            title="No matches yet"
            description="When you and another person like each other, they'll appear here."
        />
      </div>
    );
  };

  return (
    <div className="p-4 animate-fade-in h-full flex flex-col">
      <h1 className="text-3xl font-bold text-white mb-6 flex-shrink-0">Your Matches</h1>
      
      <div className="flex-grow">
        {renderContent()}
      </div>

      <AnswerQuestionModal
        isOpen={!!matchToAnswer}
        match={matchToAnswer}
        onClose={() => setMatchToAnswer(null)}
        onSend={handleSendAnswer}
      />
    </div>
  );
};

export default MatchesScreen;