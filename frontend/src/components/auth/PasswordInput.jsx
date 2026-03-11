import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const getPasswordStrength = (password) => {
    if (!password) return { label: 'None', color: 'bg-gray-200', width: '0%' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score < 3) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (score < 5) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-green-500', width: '100%' };
};

export const PasswordInput = ({ name, value, onChange, label, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
    const strength = getPasswordStrength(value);

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    required
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-transparent outline-none transition-all dark:text-white pr-10"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>
            
            {value && name === 'password' && (
                <div className="mt-2 text-xs">
                    <div className="flex justify-between mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Password strength</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{strength.label}</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                            className={`h-full ${strength.color} transition-all duration-300`} 
                            style={{ width: strength.width }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};
