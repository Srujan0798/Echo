
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import { Mic, Chrome } from '../components/icons';

const WelcomeScreen: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    // Router will handle navigation on state change, but this can be a fallback
    navigate('/');
  };

  return (
    <PageLayout className="justify-between">
      <div className="text-center w-full pt-16">
        <Mic className="mx-auto h-16 w-16 text-[#FF6B6B] mb-6" />
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Welcome to ECHO</h1>
        <p className="text-[#B3B3B3] text-lg max-w-xs mx-auto">
          Connect through voice. Share your story, hear theirs, and discover a deeper connection.
        </p>
      </div>

      <div className="w-full pb-8">
        <Button 
          onClick={handleLogin} 
          isLoading={isLoading} 
          icon={<Chrome className="h-5 w-5" />}
          variant="secondary"
        >
          Continue with Google
        </Button>
        <p className="text-center text-xs text-[#B3B3B3] mt-4 px-4">
          By continuing, you agree to our{' '}
          <Link to="/terms" className="underline hover:text-white">
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="underline hover:text-white">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </PageLayout>
  );
};

export default WelcomeScreen;