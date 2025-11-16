
import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useAuth } from '../../hooks/useAuth';
import ProgressBar from '../../components/ProgressBar';
import Button from '../../components/Button';

const onboardingSteps = [
  'basic-info',
  'vibe-graphic',
  'vibe-hook',
  'voice-prompts',
  'preview',
];

const OnboardingLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, totalSteps } = useOnboarding();
  const { completeOnboarding } = useAuth();

  const currentStepIndex = useMemo(() => {
    const path = location.pathname.split('/').pop() || '';
    return onboardingSteps.indexOf(path);
  }, [location.pathname]);

  const currentStepNumber = currentStepIndex + 1;
  
  const isNextDisabled = useMemo(() => {
    switch(onboardingSteps[currentStepIndex]) {
        case 'basic-info':
            const nameValid = profile.name.length >= 2 && profile.name.length <= 50 && /^[a-zA-Z\s'-]+$/.test(profile.name);
            const ageValid = profile.age >= 18 && profile.age <= 65;
            return !nameValid || !ageValid || !profile.gender || !profile.lookingFor;
        case 'vibe-hook':
            return !profile.vibeHook;
        case 'voice-prompts':
            return profile.voicePrompts.length < 3 || profile.voicePrompts.some(p => !p.answer);
        default:
            return false;
    }
  }, [profile, currentStepIndex]);


  const handleNext = () => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      navigate(`/onboarding/${onboardingSteps[currentStepIndex + 1]}`);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      navigate(`/onboarding/${onboardingSteps[currentStepIndex - 1]}`);
    }
  };
  
  const handleFinish = () => {
    completeOnboarding(profile);
    navigate('/');
  };

  return (
    <div className="bg-[#121212] min-h-screen text-white flex flex-col p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto flex flex-col flex-grow">
        <div className="pt-8 pb-6">
          <ProgressBar current={currentStepNumber} total={totalSteps} />
        </div>
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
        <footer className="py-4">
          <div className="flex gap-4">
            {currentStepIndex > 0 && (
              <Button onClick={handleBack} variant="secondary">Back</Button>
            )}
            {currentStepIndex < onboardingSteps.length - 1 ? (
              <Button onClick={handleNext} disabled={isNextDisabled}>Next</Button>
            ) : (
              <Button onClick={handleFinish}>Finish & View Profile</Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OnboardingLayout;
