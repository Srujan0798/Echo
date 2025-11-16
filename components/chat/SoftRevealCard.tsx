import React from 'react';

interface SoftRevealCardProps {
    profileImageUrl: string;
}

const SoftRevealCard: React.FC<SoftRevealCardProps> = ({ profileImageUrl }) => {
    return (
        <div className="bg-[#282828] rounded-lg p-4 my-4 text-center animate-fade-in">
            <p className="font-bold text-white mb-3">Soft Reveal Unlocked ✨</p>
            <div className="relative w-48 h-64 mx-auto rounded-lg overflow-hidden group">
                <img 
                    src={profileImageUrl}
                    alt="Blurred profile" 
                    className="w-full h-full object-cover scale-110"
                    style={{ filter: 'blur(20px) brightness(0.7) contrast(1.2)' }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                   <p className="text-white font-bold text-3xl opacity-30">?</p>
                </div>
            </div>
            <p className="text-xs text-[#B3B3B3] mt-3">Full reveal is available when you're both ready. Let them know in the header!</p>
        </div>
    );
};

export default SoftRevealCard;
