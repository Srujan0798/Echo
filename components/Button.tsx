
import React from 'react';
import { Loader } from './icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full flex items-center justify-center font-bold py-3 px-4 rounded-full transition-transform duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#121212]';

  const variantStyles = {
    primary: 'bg-[#FF6B6B] text-white hover:bg-opacity-90 focus:ring-[#FF6B6B]',
    secondary: 'bg-[#282828] text-white hover:bg-opacity-80 focus:ring-white',
    outline: 'bg-transparent border-2 border-[#B3B3B3] text-[#B3B3B3] hover:bg-[#282828] hover:text-white',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${isLoading ? 'cursor-not-allowed opacity-75' : ''} ${className}`;

  return (
    <button className={combinedClassName} disabled={isLoading} {...props}>
      {isLoading ? (
        <Loader className="animate-spin h-6 w-6" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
