import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-stack-sm w-full">
      {label && <label className="font-label-md text-label-md text-on-surface-variant" htmlFor={props.id}>{label}</label>}
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ fontSize: '20px' }}>
            {icon}
          </span>
        )}
        <input
          className={`w-full ${icon ? 'pl-12' : 'px-4'} pr-4 py-3 rounded-lg border border-outline-variant bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-body-md ${error ? 'border-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-error text-label-sm">{error}</p>}
    </div>
  );
};
