import React, { useState, useEffect } from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import VoiceRecorder from '../../../components/VoiceRecorder';
import Button from '../../../components/Button';
import { Shuffle } from '../../../components/icons';

const ALL_PROMPTS = [
  "What's the weirdest food you've ever eaten?",
  "If you were a ghost, who would you haunt and why?",
  "Describe your perfect day, but you can only use sound effects.",
  "What's a song you can listen to on repeat?",
  "Tell me your favorite joke.",
  "If animals could talk, which would be the rudest?",
  "What's the most useless talent you have?",
  "You can have an unlimited supply of one thing. What is it?",
  "What's a small thing that makes you happy?",
  "What movie quote do you use way too often?",
];

const getThreeRandomPrompts = (existingIds: number[]) => {
    const available = ALL_PROMPTS.map((p, i) => ({ id: i, prompt: p }))
        .filter(p => !existingIds.includes(p.id));
    
    return available.sort(() => 0.5 - Math.random()).slice(0, 3);
}

const VoicePromptsStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();

  useEffect(() => {
    if (profile.voicePrompts.length === 0) {
      const initialPrompts = getThreeRandomPrompts([]).map(p => ({ ...p, answer: null }));
      updateProfile({ voicePrompts: initialPrompts });
    }
  }, []);
  
  const handleShuffle = () => {
      const existingIds = profile.voicePrompts.map(p => p.id);
      const newPrompts = getThreeRandomPrompts(existingIds).map(p => ({ ...p, answer: null }));
      updateProfile({ voicePrompts: newPrompts });
  };
  
  const handleRecordingUpdate = (promptId: number, blob: Blob) => {
      const updatedPrompts = profile.voicePrompts.map(p => 
        p.id === promptId ? { ...p, answer: blob } : p
      );
      updateProfile({ voicePrompts: updatedPrompts });
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Answer three prompts.</h1>
                <p className="text-[#B3B3B3]">Let your personality shine through.</p>
            </div>
            <Button onClick={handleShuffle} variant="outline" className="!w-auto px-3 py-2">
                <Shuffle size={20} />
            </Button>
        </div>
        
        <div className="space-y-4 overflow-y-auto flex-grow pr-2">
            {profile.voicePrompts.map((promptItem) => (
                <div key={promptItem.id}>
                    <h2 className="font-semibold text-white mb-2">{promptItem.prompt}</h2>
                    <VoiceRecorder 
                        maxDuration={30}
                        onRecordingComplete={(blob) => handleRecordingUpdate(promptItem.id, blob)}
                        // @FIX: Ensure the prop type matches `Blob | null`. If the value is 'recorded' (a string), pass a new Blob to keep the UI state as 'recorded'.
                        existingRecording={typeof promptItem.answer !== 'string' ? promptItem.answer : new Blob()}
                    />
                </div>
            ))}
        </div>
    </div>
  );
};

export default VoicePromptsStep;