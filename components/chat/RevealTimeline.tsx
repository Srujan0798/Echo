
import React from 'react';
import { RevealStatusInfo } from '../../utils/reveal';

interface RevealTimelineProps {
  status: RevealStatusInfo;
}

const TimelineItem: React.FC<{ isComplete: boolean; isCurrent?: boolean; children: React.ReactNode }> = ({ isComplete, isCurrent = false, children }) => (
    <div className={`flex items-center gap-3 ${isComplete ? 'text-white' : 'text-[#B3B3B3]'}`}>
        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isComplete ? 'bg-[#FF6B6B]' : 'bg-[#282828] border-2 border-[#B3B3B3]'}`}>
            {isComplete ? '✓' : isCurrent ? <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> : <div className="w-2 h-2 bg-[#B3B3B3] rounded-full"></div>}
        </div>
        <span className={isCurrent ? 'font-bold text-white' : ''}>{children}</span>
    </div>
);

const RevealTimeline: React.FC<RevealTimelineProps> = ({ status }) => {
  const isSoftAvailable = status.phase !== 'LOCKED' && status.phase !== 'COUNTDOWN';
  const isWaiting = status.phase === 'WAITING_FOR_PARTNER' || status.phase === 'WAITING_FOR_YOU';

  return (
    <div className="bg-[#282828] rounded-lg p-4 my-4 animate-fade-in space-y-3">
        <h3 className="font-bold text-white text-center mb-3">Connection Timeline</h3>
        <TimelineItem isComplete={true}>
            Connection Started
        </TimelineItem>
        <TimelineItem isComplete={isSoftAvailable} isCurrent={status.phase === 'SOFT_AVAILABLE'}>
            Soft Reveal Unlocked
        </TimelineItem>
        <TimelineItem isComplete={status.isFullyRevealed} isCurrent={isWaiting}>
            Waiting for both to be ready...
        </TimelineItem>
        <TimelineItem isComplete={status.isFullyRevealed} isCurrent={status.isFullyRevealed}>
            Full Reveal!
        </TimelineItem>
    </div>
  );
};

export default RevealTimeline;