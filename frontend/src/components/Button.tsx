import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-2 rounded-lg font-bold transition-all focus:outline-none";
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary/90",
    secondary: "bg-secondary-container text-on-secondary-container hover:scale-105 shadow-lg",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-on-primary",
    ghost: "p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
