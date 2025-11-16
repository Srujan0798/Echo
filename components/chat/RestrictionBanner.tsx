
import React from 'react';

interface RestrictionBannerProps {
  chatStartedTimestamp?: number;
}

const RestrictionBanner: React.FC<RestrictionBannerProps> = ({ chatStartedTimestamp }) => {
  if (!chatStartedTimestamp) return null;

  const isWithin24Hours = Date.now() - chatStartedTimestamp < 24 * 60 * 60 * 1000;
  
  if (isWithin24Hours) {
    return (
      <div className="bg-[#FF6B6B]/20 text-center p-2 text-xs text-white animate-fade-in">
        🔒 Voice and text only - Photos & full profiles unlock after 24 hours.
      </div>
    );
  }

  return (
    <div className="bg-green-500/20 text-center p-2 text-xs text-white animate-fade-in">
      ✨ Soft reveal is now available! Get to know each other better.
    </div>
  );
};

export default RestrictionBanner;