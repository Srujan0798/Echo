import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/Button';
import { LogOut, Mic, Shield, ChevronRight, Trash2 } from '../../components/icons';
import { UserSettings } from '../../types';
import SettingsSection from '../../components/settings/SettingsSection';
import SettingsItem from '../../components/settings/SettingsItem';
import ConfirmationModal from '../../components/settings/ConfirmationModal';
import { getSettings, saveSettings } from '../../utils/localStorage';
import Toast from '../../components/Toast';

const defaultSettings: UserSettings = {
  notifications: { matches: true, messages: true },
  privacy: { showOnEcho: true, distance: 50 },
};

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);

  useEffect(() => {
    if (user) {
      const savedSettings = getSettings(user.id);
      if (savedSettings) {
        setSettings(savedSettings);
      }
    }
  }, [user]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prevSettings => {
        const updated = {
            ...prevSettings,
            ...newSettings,
            notifications: {
                ...prevSettings.notifications,
                ...newSettings.notifications,
            },
            privacy: {
                ...prevSettings.privacy,
                ...newSettings.privacy,
            },
        };
        if (user) {
            saveSettings(user.id, updated);
        }
        setShowSaveToast(true);
        return updated;
    });
  };
  
  const handleDeleteAccount = () => {
    if (user) {
        // Clear all user-related data
        localStorage.removeItem(`echo-user`);
        localStorage.removeItem(`echo-profile-${user.id}`);
        localStorage.removeItem(`echo-swiped-${user.id}`);
        localStorage.removeItem(`echo-matches-${user.id}`);
        localStorage.removeItem(`echo-settings-${user.id}`);
        // In a real app, you would also delete chat histories
    }
    setDeleteModalOpen(false);
    logout();
    navigate('/welcome');
  };

  return (
    <div className="p-4 animate-fade-in h-full overflow-y-auto pb-16">
      <div className="text-center mb-8">
        <img
          src={user?.avatarUrl || 'https://picsum.photos/100'}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mb-4 border-4 border-[#282828] shadow-lg mx-auto"
        />
        <h1 className="text-2xl font-bold">Hey, {user?.name}!</h1>
        <p className="text-[#B3B3B3] text-sm">{user?.email}</p>
      </div>

      <div className="space-y-6">
        <SettingsSection title="Profile">
          <SettingsItem icon={<Mic />} label="Edit Profile" onClick={() => navigate('/profile/edit')}>
            <ChevronRight />
          </SettingsItem>
        </SettingsSection>
        
        <SettingsSection title="Account Settings">
          <SettingsItem icon={<Shield />} label="Match Notifications">
{/* @FIX: Pass the full notifications object to satisfy the UserSettings type. */}
             <input type="checkbox" className="toggle toggle-accent" checked={settings.notifications.matches} onChange={e => updateSettings({ notifications: { ...settings.notifications, matches: e.target.checked}})} />
          </SettingsItem>
           <SettingsItem icon={<Shield />} label="Message Notifications">
{/* @FIX: Pass the full notifications object to satisfy the UserSettings type. */}
             <input type="checkbox" className="toggle toggle-accent" checked={settings.notifications.messages} onChange={e => updateSettings({ notifications: { ...settings.notifications, messages: e.target.checked}})} />
          </SettingsItem>
        </SettingsSection>
        
        <SettingsSection title="Privacy">
           <SettingsItem icon={<Shield />} label="Show me on ECHO">
{/* @FIX: Pass the full privacy object to satisfy the UserSettings type. */}
             <input type="checkbox" className="toggle toggle-accent" checked={settings.privacy.showOnEcho} onChange={e => updateSettings({ privacy: { ...settings.privacy, showOnEcho: e.target.checked}})} />
           </SettingsItem>
           <div className="p-4">
             <label className="text-sm text-[#B3B3B3] mb-2 block">Distance Preference</label>
{/* @FIX: Pass the full privacy object to satisfy the UserSettings type. */}
             <input type="range" min="1" max="100" value={settings.privacy.distance} onChange={e => updateSettings({ privacy: { ...settings.privacy, distance: parseInt(e.target.value)} })} className="range range-xs range-accent" />
             <div className="text-right text-sm font-bold">{settings.privacy.distance} mi.</div>
           </div>
        </SettingsSection>

        <div className="pt-4 space-y-3">
          <Button onClick={logout} variant="secondary" icon={<LogOut className="h-5 w-5"/>}>
            Logout
          </Button>
          <Button onClick={() => setDeleteModalOpen(true)} variant="outline" className="!text-red-500 !border-red-500/50 hover:!bg-red-500/10">
            <Trash2 className="h-5 w-5 mr-2" /> Delete Account
          </Button>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        confirmText="Yes, Delete"
      >
        <p className="text-[#B3B3B3]">Are you sure you want to permanently delete your account? All of your matches and data will be lost. This action cannot be undone.</p>
      </ConfirmationModal>

      <Toast message="Settings saved!" show={showSaveToast} onDismiss={() => setShowSaveToast(false)} />
    </div>
  );
};

export default ProfileScreen;