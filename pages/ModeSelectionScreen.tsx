import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Logo from '../components/Logo';
import PageLayout from '../components/PageLayout';
import { Wrench, User } from '../components/icons';

const ModeSelectionScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const handleModeSelect = (mode: 'user' | 'developer') => {
    if (mode === 'developer') {
        const pass = prompt("Enter developer password:");
        if (pass === "password1003") {
            localStorage.setItem('echo-app-mode', mode);
            // Using reload to force the AppRouter to re-check the mode
            window.location.reload();
        } else if (pass !== null) { // Don't alert if they clicked "cancel"
            alert("Incorrect password.");
        }
    } else {
        localStorage.setItem('echo-app-mode', mode);
        // Using reload to force the AppRouter to re-check the mode
        window.location.reload();
    }
  };

  return (
    <PageLayout className="justify-between">
      <div className="text-center w-full pt-16">
        <Logo className="mb-8" />
        <h1 className="text-3xl font-bold text-white mb-4">Choose Your Mode</h1>
        <p className="text-[#B3B3B3] text-lg max-w-xs mx-auto">
          Select how you'd like to experience ECHO
        </p>
      </div>

      <div className="w-full pb-8 space-y-4">
        <Button 
          onClick={() => handleModeSelect('user')}
          icon={<User className="h-5 w-5" />}
        >
          User Mode
        </Button>
        <Button 
          onClick={() => handleModeSelect('developer')}
          variant="secondary"
          icon={<Wrench className="h-5 w-5" />}
        >
          Developer Mode
        </Button>
        <p className="text-center text-xs text-[#B3B3B3] mt-4">
          Developer Mode enables timer controls and dual-role testing
        </p>
      </div>
    </PageLayout>
  );
};

export default ModeSelectionScreen;
