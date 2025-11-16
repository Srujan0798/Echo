
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'text-2xl' | 'text-4xl';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'text-4xl' }) => {
  return (
    <div className={`flex items-center text-white font-bold tracking-tight ${className} ${size}`}>
      <span>ECH</span>
      <span className="text-[#FF6B6B]">O</span>
    </div>
  );
};

export default Logo;