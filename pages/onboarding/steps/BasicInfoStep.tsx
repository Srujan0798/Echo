import React from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
// Fix: Cannot find name 'Profile'. Imported the Profile type.
import { Profile } from '../../../types';

const BasicInfoStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();

  const renderSelect = (id: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: string[], placeholder: string) => (
    <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full bg-[#282828] border border-gray-600 text-white rounded-lg p-3 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none"
    >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  );

  return (
    <div className="flex flex-col h-full animate-fade-in">
        <h1 className="text-3xl font-bold text-white mb-2">First, the basics.</h1>
        <p className="text-[#B3B3B3] mb-8">This helps us find the right people for you.</p>

        <form className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#B3B3B3] mb-2">Your Name</label>
                <input
                    type="text"
                    id="name"
                    value={profile.name}
                    onChange={(e) => updateProfile({ name: e.target.value })}
                    className="w-full bg-[#282828] border border-gray-600 text-white rounded-lg p-3 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none"
                    placeholder="e.g. Alex"
                />
            </div>
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-[#B3B3B3] mb-2">Age</label>
                <input
                    type="number"
                    id="age"
                    value={profile.age}
                    onChange={(e) => updateProfile({ age: parseInt(e.target.value, 10) })}
                    min="18"
                    max="65"
                    className="w-full bg-[#282828] border border-gray-600 text-white rounded-lg p-3 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none"
                />
            </div>
             <div>
                <label htmlFor="gender" className="block text-sm font-medium text-[#B3B3B3] mb-2">Your Gender</label>
                {renderSelect('gender', profile.gender, e => updateProfile({ gender: e.target.value as Profile['gender'] }), ['Male', 'Female', 'Other'], 'Select your gender')}
            </div>
            <div>
                <label htmlFor="lookingFor" className="block text-sm font-medium text-[#B3B3B3] mb-2">Looking For</label>
                {renderSelect('lookingFor', profile.lookingFor, e => updateProfile({ lookingFor: e.target.value as Profile['lookingFor'] }), ['Men', 'Women', 'Everyone'], 'Select a preference')}
            </div>
        </form>
    </div>
  );
};

export default BasicInfoStep;
