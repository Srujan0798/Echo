
import React, { useState, useEffect } from 'react';
import { formatTimeUntil } from '../../utils/reveal';

interface RevealCountdownProps {
  unlockTime: number;
}

const RevealCountdown: React.FC<RevealCountdownProps> = ({ unlockTime }) => {
  const [timeLeft, setTimeLeft] = useState(unlockTime - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = unlockTime - Date.now();
      if (remaining <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        // A parent component could listen for this and refresh state
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [unlockTime]);

  return (
    <div className="bg-[#FF6B6B]/20 text-center p-2 text-xs text-white animate-fade-in">
      ⏳ Soft reveal unlocks in <span className="font-bold">{formatTimeUntil(timeLeft)}</span>
    </div>
  );
};

export default RevealCountdown;