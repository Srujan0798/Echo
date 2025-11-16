import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getProfile, saveProfile } from '../../utils/localStorage';
import { Profile } from '../../types';
import Button from '../../components/Button';
import PageLayout from '../../components/PageLayout';
import { X } from '../../components/icons';

const EditProfileScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const userProfile = getProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
      setIsLoading(false);
    }
  }, [user]);

  const handleUpdate = (updates: Partial<Profile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const handleSave = () => {
    if (user && profile) {
      saveProfile(user.id, profile);
      navigate('/profile');
    }
  };
  
  if (isLoading) {
    return <PageLayout><div>Loading profile...</div></PageLayout>;
  }

  if (!profile) {
    return <PageLayout><div>Could not load profile.</div></PageLayout>;
  }

  return (
    <div className="bg-[#121212] min-h-screen text-white p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white/10">
          <X size={24} />
        </button>
      </header>

      <div className="space-y-6 max-w-md mx-auto">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#B3B3B3] mb-2">Your Name</label>
          <input
            type="text"
            id="name"
            value={profile.name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            className="w-full bg-[#282828] border border-gray-600 text-white rounded-lg p-3 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-[#B3B3B3] mb-2">Age</label>
          <input
            type="number"
            id="age"
            value={profile.age}
            onChange={(e) => handleUpdate({ age: parseInt(e.target.value, 10) })}
            min="18" max="99"
            className="w-full bg-[#282828] border border-gray-600 text-white rounded-lg p-3 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none"
          />
        </div>

        {/* Add more editable fields for Vibe Graphic, Prompts etc. as needed */}
        <p className="text-sm text-center text-[#B3B3B3]">
            Editing for Vibe Graphic and Voice Prompts can be added here.
        </p>

        <div className="pt-4">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileScreen;
