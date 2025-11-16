
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';

const TermsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <PageLayout className="justify-start pt-16">
      <div className="flex flex-col h-full w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Terms & Conditions</h1>
        <div className="flex-grow bg-[#282828] p-4 rounded-lg overflow-y-auto h-96 mb-6 text-sm text-[#B3B3B3] space-y-4">
          <h2 className="text-white font-bold">1. Introduction</h2>
          <p>Welcome to ECHO. By using our app, you agree to these terms. Please read them carefully.</p>
          <h2 className="text-white font-bold">2. User Content</h2>
          <p>You are responsible for your content, including voice recordings. Do not post illegal, hateful, or explicit material. We reserve the right to remove any content and terminate accounts that violate our policies.</p>
          <h2 className="text-white font-bold">3. Privacy</h2>
          <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and share your personal information.</p>
          <h2 className="text-white font-bold">4. Prohibited Activities</h2>
          <p>You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the service in any medium; (ii) using any automated system, including "robots," "spiders," "offline readers," etc., to access the service; (iii) transmitting spam, chain letters, or other unsolicited email; (iv) attempting to interfere with, compromise the system integrity or security or decipher any transmissions to or from the servers running the service.</p>
          <h2 className="text-white font-bold">5. Limitation of Liability</h2>
          <p>In no event shall ECHO, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        </div>
        <div className="flex items-center mb-6">
          <input
            id="agree-checkbox"
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="w-5 h-5 text-[#FF6B6B] bg-gray-700 border-gray-600 rounded focus:ring-[#FF6B6B] focus:ring-2"
          />
          <label htmlFor="agree-checkbox" className="ml-3 text-sm font-medium text-gray-300">
            I have read and agree to the Terms & Conditions.
          </label>
        </div>
        <div className="sticky bottom-8 w-full">
          <Button onClick={() => navigate(-1)} disabled={!agreed}>
            Accept & Continue
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default TermsScreen;
