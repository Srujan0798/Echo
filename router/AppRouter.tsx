import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { OnboardingProvider } from '../contexts/OnboardingContext';
import { MatchProvider } from '../contexts/MatchContext';
import { DeveloperProvider } from '../contexts/DeveloperContext';

// Components
import ErrorBoundary from '../components/ErrorBoundary';
import MainLayout from '../components/MainLayout';
import OnboardingLayout from '../pages/onboarding/OnboardingLayout';

// Auth & General Screens
import SplashScreen from '../pages/SplashScreen';
import WelcomeScreen from '../pages/WelcomeScreen';
import TermsScreen from '../pages/TermsScreen';
import PrivacyScreen from '../pages/PrivacyScreen';
import ChatScreen from '../pages/chat/ChatScreen';
import ModeSelectionScreen from '../pages/ModeSelectionScreen';


// Main App Screens (Tabs)
import DiscoverScreen from '../pages/discover/DiscoverScreen';
import MatchesScreen from '../pages/matches/MatchesScreen';
import ConnectionScreen from '../pages/connection/ConnectionScreen';
import ProfileScreen from '../pages/profile/ProfileScreen';
import EditProfileScreen from '../pages/profile/EditProfileScreen';


// Onboarding Steps
import BasicInfoStep from '../pages/onboarding/steps/BasicInfoStep';
import VibeGraphicStep from '../pages/onboarding/steps/VibeGraphicStep';
import VibeHookStep from '../pages/onboarding/steps/VibeHookStep';
import VoicePromptsStep from '../pages/onboarding/steps/VoicePromptsStep';
import ProfilePreviewStep from '../pages/onboarding/steps/ProfilePreviewStep';


const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading, isProfileComplete } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  
  // Initialize state directly from localStorage to ensure correctness on reload
  const [modeSelected, setModeSelected] = useState(() => !!localStorage.getItem('echo-app-mode'));

  // This effect ensures the state updates correctly on logout without a full reload
  useEffect(() => {
    const mode = localStorage.getItem('echo-app-mode');
    setModeSelected(!!mode);
  }, [isAuthenticated]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  if (showSplash || isLoading) {
    return <SplashScreen />;
  }
  
  if (!modeSelected) {
      return (
          <HashRouter>
              <Routes>
                  <Route path="*" element={<ModeSelectionScreen />} />
              </Routes>
          </HashRouter>
      );
  }

  const AuthenticatedRoutes = () => (
    <MatchProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DiscoverScreen />} />
          <Route path="matches" element={<MatchesScreen />} />
          <Route path="connection" element={<ConnectionScreen />} />
          <Route path="profile" element={<ProfileScreen />} />
          <Route path="profile/edit" element={<EditProfileScreen />} />
          <Route path="chat/:matchId" element={<ChatScreen />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        {isAuthenticated && isProfileComplete && <Route path="/welcome" element={<Navigate to="/" replace />} />}
      </Routes>
    </MatchProvider>
  );

  const OnboardingRoutes = () => (
     <OnboardingProvider>
        <Routes>
            <Route path="/onboarding" element={<OnboardingLayout />}>
                <Route index element={<Navigate to="basic-info" replace />} />
                <Route path="basic-info" element={<BasicInfoStep />} />
                <Route path="vibe-graphic" element={<VibeGraphicStep />} />
                <Route path="vibe-hook" element={<VibeHookStep />} />
                <Route path="voice-prompts" element={<VoicePromptsStep />} />
                <Route path="preview" element={<ProfilePreviewStep />} />
            </Route>
            <Route path="*" element={<Navigate to="/onboarding" />} />
        </Routes>
     </OnboardingProvider>
  );

  const UnauthenticatedRoutes = () => (
    <Routes>
        <Route path="/welcome" element={<WelcomeScreen />} />
        <Route path="/terms" element={<TermsScreen />} />
        <Route path="/privacy" element={<PrivacyScreen />} />
        <Route path="*" element={<Navigate to="/welcome" />} />
    </Routes>
  );

  return (
    <HashRouter>
      <DeveloperProvider>
        <ErrorBoundary>
          {!isAuthenticated ? (
            <UnauthenticatedRoutes />
          ) : !isProfileComplete ? (
            <OnboardingRoutes />
          ) : (
            <AuthenticatedRoutes />
          )}
        </ErrorBoundary>
      </DeveloperProvider>
    </HashRouter>
  );
};

export default AppRouter;