
import React from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import VoiceRecorder from '../../../components/VoiceRecorder';

const VibeHookStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();

  return (
    <div className="flex flex-col h-full animate-fade-in items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Record your VibeHook.</h1>
        <p className="text-[#B3B3B3] mb-8 max-w-sm">
            This is your 15-second audio intro. Make it count! What's a fun fact about you?
        </p>

        <VoiceRecorder
            maxDuration={15}
            onRecordingComplete={(blob) => updateProfile({ vibeHook: blob })}
            existingRecording={profile.vibeHook instanceof Blob ? profile.vibeHook : null}
        />
    </div>
  );
};

export default VibeHookStep;