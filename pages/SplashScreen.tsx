
import React from 'react';
import Logo from '../components/Logo';
import PageLayout from '../components/PageLayout';

const SplashScreen: React.FC = () => {
  return (
    <PageLayout className="justify-center">
      <div className="flex flex-col items-center animate-pulse">
        <Logo className="h-16" />
        <p className="text-center text-lg text-[#B3B3B3] mt-4 font-light tracking-wider">
          Date the Voice, Then the Person.
        </p>
      </div>
    </PageLayout>
  );
};

export default SplashScreen;
