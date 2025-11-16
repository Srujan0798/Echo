
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import PageLayout from '../components/PageLayout';
import { LogOut } from '../components/icons';

const HomeScreen: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <PageLayout>
      <div className="text-center w-full flex flex-col items-center">
        <img
          src={user?.avatarUrl || 'https://picsum.photos/100'}
          alt="User Avatar"
          className="w-24 h-24 rounded-full mb-6 border-4 border-[#282828]"
        />
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-[#B3B3B3] mb-8">{user?.email}</p>
        
        <div className="bg-[#282828] p-6 rounded-lg w-full text-left mb-8">
            <h2 className="text-white text-lg font-semibold mb-4">App Content Placeholder</h2>
            <p className="text-[#B3B3B3]">The main dating app features would be displayed here.</p>
        </div>

        <div className="w-full">
            <Button onClick={logout} variant="outline" icon={<LogOut className="h-5 w-5"/>}>
            Logout
            </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomeScreen;