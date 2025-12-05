
import React, { useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, rightElement, className, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`group mb-5 ${className}`}>
      <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-viveris-red">
        {label}
      </label>
      <div className={`
        relative flex items-center bg-slate-100 rounded-2xl transition-all duration-300 border-2
        ${isFocused ? 'border-viveris-red bg-white shadow-sm ring-4 ring-red-50' : 'border-transparent hover:bg-slate-200/70'}
      `}>
        {icon && (
          <div className={`
            pl-4 pr-2 text-slate-400 transition-colors duration-300
            ${isFocused ? 'text-viveris-red' : ''}
          `}>
            {icon}
          </div>
        )}
        
        <input
          {...props}
          className={`
            w-full bg-transparent text-slate-900 rounded-2xl px-3 py-3.5 outline-none font-medium placeholder-slate-400
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
        />

        {rightElement && (
          <div className="pr-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
};
