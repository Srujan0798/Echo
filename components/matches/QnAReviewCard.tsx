import React from 'react';
import { Match } from '../../types';
import AudioPlayer from '../common/AudioPlayer';

interface QnAReviewCardProps {
    customQuestion: NonNullable<Match['customQuestion']>;
    profileName: string;
}

const QnAReviewCard: React.FC<QnAReviewCardProps> = ({ customQuestion, profileName }) => {
  const userAsked = customQuestion.askedBy === 'USER'; // This needs to be the actual user ID

  return (
    <div className="bg-[#1e1e1e] p-3 rounded-lg space-y-3">
       <AudioPlayer title={userAsked ? "Your Question" : `${profileName}'s Question`} />
       <AudioPlayer title={userAsked ? `${profileName}'s Answer` : "Your Answer"} />
    </div>
  );
};

export default QnAReviewCard;
