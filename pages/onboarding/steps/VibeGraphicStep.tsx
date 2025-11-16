
import React from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { Check } from '../../../components/icons';

const vibeGradients = [
  'bg-gradient-to-br from-pink-500 to-yellow-500', 'bg-gradient-to-br from-purple-600 to-blue-500',
  'bg-gradient-to-br from-green-400 to-blue-500', 'bg-gradient-to-br from-red-500 to-orange-500',
  'bg-gradient-to-br from-teal-400 to-yellow-200', 'bg-gradient-to-br from-indigo-500 to-pink-500',
  'bg-gradient-to-br from-gray-700 via-gray-900 to-black', 'bg-gradient-to-br from-green-200 via-green-400 to-green-500',
  'bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900', 'bg-gradient-to-br from-red-400 via-gray-300 to-blue-500',
  'bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-700', 'bg-gradient-to-br from-purple-200 via-purple-400 to-purple-800'
];

const VibeGraphicStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();

  return (
    <div className="flex flex-col h-full animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">Choose your vibe.</h1>
        <p className="text-[#B3B3B3] mb-6">This graphic represents you on ECHO. Pick one that feels right.</p>

        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2 text-center">Your Vibe Card</h2>
            <div className={`w-full h-32 rounded-lg shadow-lg flex items-center justify-center ${profile.vibeGraphic}`}>
                <span className="text-white text-2xl font-bold text-shadow-lg">Your Name</span>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
            {vibeGradients.map((gradient) => (
                <button
                    key={gradient}
                    onClick={() => updateProfile({ vibeGraphic: gradient })}
                    className={`relative w-full aspect-square rounded-lg transition-transform hover:scale-105 ${gradient}`}
                >
                    {profile.vibeGraphic === gradient && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                            <Check className="h-8 w-8 text-white" />
                        </div>
                    )}
                </button>
            ))}
        </div>
    </div>
  );
};

export default VibeGraphicStep;