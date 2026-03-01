import { useState } from 'react';

const SVGShow = () => (
    // Actually SVG for hide (with strikethrough) usually means "click to hide", but based on standard: 
    // Let's just use what user gave us directly
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M168-432q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35ZM96-192v-72h768v72H96Zm299-275q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Zm312 0q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Z" />
    </svg>
);

const SVGHide = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
        <path d="M160-440q-50 0-85-35t-35-85q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35Zm555-35q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35Zm-135-19L414-660q14-10 31-15t35-5q50 0 85 35t35 85q0 18-5 35t-15 31ZM792-56 648-200H80v-80h488L56-792l56-56 736 736-56 56Z" />
    </svg>
);

export const PasswordInput = ({ name, value, onChange, placeholder, label = "Password", showForgotPassword = false }) => {
    const [showPassword, setShowPassword] = useState(false);

    // Calculate password strength dynamically
    const getStrength = (pwd) => {
        let score = 0;
        if (!pwd) return { label: '', color: 'bg-gray-200', text: '' };
        if (pwd.length > 5) score += 1;
        if (pwd.length > 8) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

        if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-500', width: 'w-1/3' };
        if (score <= 4) return { label: 'Medium', color: 'bg-yellow-500', text: 'text-yellow-500', width: 'w-2/3' };
        return { label: 'Strong', color: 'bg-green-500', text: 'text-green-500', width: 'w-full' };
    };

    const strength = value ? getStrength(value) : null;

    return (
        <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                {showForgotPassword && (
                    <a href="#" className="text-sm font-medium text-agri-600 hover:text-agri-500 dark:text-agri-400 transition-colors">
                        Forgot password?
                    </a>
                )}
            </div>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    name={name}
                    required
                    value={value}
                    onChange={onChange}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-transparent outline-none transition-all dark:text-white pr-12"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? <SVGShow /> : <SVGHide />}
                </button>
            </div>

            {/* Dynamic Password Strength UI rendering */}
            {value && (
                <div className="mt-2 text-left">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 transition-all overflow-hidden mb-1">
                        <div className={`h-1.5 rounded-full ${strength.color} ${strength.width} transition-all duration-300`}></div>
                    </div>
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${strength.text} transition-colors duration-300`}>
                        Password Quality: {strength.label}
                    </span>
                </div>
            )}
        </div>
    );
};
