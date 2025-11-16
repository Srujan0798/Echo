
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { Mic } from '../../../components/icons';

const ProfilePreviewStep: React.FC = () => {
    const { profile } = useOnboarding();
    const navigate = useNavigate();

    const InfoChip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div className="bg-[#282828] text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            {children}
        </div>
    );

    const AudioPrompt: React.FC<{ prompt: string }> = ({ prompt }) => (
        <div className="bg-[#282828] p-4 rounded-lg">
            <p className="text-[#B3B3B3] text-sm mb-3">{prompt}</p>
            <div className="flex items-center gap-3">
                <button className="bg-[#FF6B6B] rounded-full p-2">
                    <Mic className="h-5 w-5 text-white" />
                </button>
                <div className="w-full h-1 bg-gray-600 rounded-full"></div>
                <span className="text-xs text-[#B3B3B3]">0:30</span>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2 text-center">Here's your profile.</h1>
            <p className="text-[#B3B3B3] mb-6 text-center">This is how others will see you on ECHO.</p>

            <div className="bg-[#1a1a1a] p-4 rounded-xl space-y-4 overflow-y-auto">
                {/* Vibe Card */}
                <div className={`relative w-full h-40 rounded-lg ${profile.vibeGraphic} flex flex-col justify-end p-4 shadow-lg`}>
                     <button onClick={() => navigate('/onboarding/vibe-graphic')} className="absolute top-2 right-2 text-xs bg-black/30 text-white px-2 py-1 rounded-full">Edit</button>
                    <h2 className="text-3xl font-bold text-white drop-shadow-md">{profile.name}, {profile.age}</h2>
                </div>

                {/* VibeHook */}
                <div className="relative bg-[#282828] p-4 rounded-lg">
                     <button onClick={() => navigate('/onboarding/vibe-hook')} className="absolute top-2 right-2 text-xs bg-black/30 text-white px-2 py-1 rounded-full">Edit</button>
                    <h3 className="font-bold text-white mb-2">VibeHook</h3>
                    <div className="flex items-center gap-3">
                        <button className="bg-[#FF6B6B] rounded-full p-3">
                            <Mic className="h-6 w-6 text-white" />
                        </button>
                        <div className="w-full h-1.5 bg-gray-600 rounded-full"></div>
                        <span className="text-sm text-[#B3B3B3]">0:15</span>
                    </div>
                </div>

                {/* About Me */}
                <div className="relative bg-[#282828] p-4 rounded-lg">
                     <button onClick={() => navigate('/onboarding/basic-info')} className="absolute top-2 right-2 text-xs bg-black/30 text-white px-2 py-1 rounded-full">Edit</button>
                    <h3 className="font-bold text-white mb-3">About Me</h3>
                    <div className="flex flex-wrap gap-2">
                        <InfoChip>{profile.gender}</InfoChip>
                        <InfoChip>Looking for {profile.lookingFor}</InfoChip>
                    </div>
                </div>

                {/* Prompts */}
                <div className="relative bg-[#1a1a1a] p-0 rounded-lg">
                    <button onClick={() => navigate('/onboarding/voice-prompts')} className="absolute top-2 right-2 text-xs bg-black/30 text-white px-2 py-1 rounded-full z-10">Edit</button>
                    <div className="space-y-3">
                      {profile.voicePrompts.map(p => <AudioPrompt key={p.id} prompt={p.prompt} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePreviewStep;