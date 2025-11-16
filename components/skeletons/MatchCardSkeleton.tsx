
import React from 'react';

const MatchCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#282828] rounded-lg p-4 flex flex-col gap-4 animate-pulse">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-gray-700 flex-shrink-0"></div>
            <div className="flex-grow space-y-2">
                <div className="h-5 w-3/4 bg-gray-700 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
            </div>
        </div>
        <div className="h-10 bg-gray-700 rounded-full"></div>
    </div>
  );
};

export default MatchCardSkeleton;