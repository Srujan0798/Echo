
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';

const PrivacyScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageLayout className="justify-start pt-16">
      <div className="flex flex-col h-full w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <div className="flex-grow bg-[#282828] p-4 rounded-lg overflow-y-auto h-96 mb-6 text-sm text-[#B3B3B3] space-y-4 leading-relaxed">
          <h2 className="text-white font-bold">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, create or modify your profile, and upload voice recordings. This includes your name, email, and any voice data you provide.</p>
          <h2 className="text-white font-bold">2. How We Use Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services. This includes matching you with other users, personalizing your experience, and for security purposes to protect our users.</p>
          <h2 className="text-white font-bold">3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as described in this policy, such as with your consent or for legal reasons. Your voice recordings are shared with other users as part of the app's core functionality.</p>
          <h2 className="text-white font-bold">4. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
          <h2 className="text-white font-bold">5. Your Choices</h2>
          <p>You may update, correct or delete information about you at any time by logging into your online account. If you wish to delete or deactivate your account, please email us, but note that we may retain certain information as required by law or for legitimate business purposes.</p>
        </div>
        <div className="sticky bottom-8 w-full">
         <Button onClick={() => navigate(-1)} variant="secondary">
           Go Back
         </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default PrivacyScreen;