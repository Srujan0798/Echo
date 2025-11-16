
import React, { useState, useMemo } from 'react';
import { useOnboarding } from '../../../hooks/useOnboarding';
import { Profile } from '../../../types';

const BasicInfoStep: React.FC = () => {
  const { profile, updateProfile } = useOnboarding();
  const [errors, setErrors] = useState({ name: '', age: '' });
  const [shake, setShake] = useState(''); // State to trigger shake animation

  const validateName = (name: string) => {
    if (name.length < 2) return "Name must be at least 2 characters.";
    if (name.length > 50) return "Name cannot exceed 50 characters.";
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return "Name can only contain letters, spaces, hyphens, and apostrophes.";
    return "";
  };

  const validateAge = (age: number) => {
    if (age < 18) return "You must be at least 18 years old.";
    if (age > 65) return "Age cannot be over 65.";
    return "";
  };
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      const error = validateName(name);
      updateProfile({ name });
      setErrors(prev => ({ ...prev, name: error }));
      if (error) {
          setShake('name');
          setTimeout(() => setShake(''), 500);
      }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const age = parseInt(e.target.value, 10);
      const error = validateAge(age);
      updateProfile({ age });
      setErrors(prev => ({ ...prev, age: error }));
      if (error) {
          setShake('age');
          setTimeout(() => setShake(''), 500);
      }
  };

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
                    onChange={handleNameChange}
                    className={`w-full bg-[#282828] border ${errors.name ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg p-3 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none ${shake === 'name' ? 'animate-shake' : ''}`}
                    placeholder="e.g. Alex"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
                <label htmlFor="age" className="block text-sm font-medium text-[#B3B3B3] mb-2">Age</label>
                <input
                    type="number"
                    id="age"
                    value={profile.age}
                    onChange={handleAgeChange}
                    min="18"
                    max="65"
                    className={`w-full bg-[#282828] border ${errors.age ? 'border-red-500' : 'border-gray-600'} text-white rounded-lg p-3 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] focus:outline-none ${shake === 'age' ? 'animate-shake' : ''}`}
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
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