import { PasswordInput, getPasswordStrength } from '../components/auth/PasswordInput';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export const Login = () => {
    const { t } = useTranslation();
    const [role, setRole] = useState('Farmer');
    const [formData, setFormData] = useState({
        identifier: '',
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const pwdStrength = getPasswordStrength(formData.password);
        if (pwdStrength.label !== 'Strong') {
            setError(`Your password is ${pwdStrength.label}. You must enter a Strong password to continue.`);
            return;
        }

        setLoading(true);
        setError('');

        const credentials = {
            phone: formData.identifier, // The backend expects phone or email, assuming phone based on schema
            password: formData.password
        };

        const result = await login(credentials);

        setLoading(false);
        if (result.success) {
            navigate('/chat');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors relative overflow-hidden">

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-agri-200/50 dark:bg-agri-900/30 blur-3xl opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-green-200/50 dark:bg-green-900/30 blur-3xl opacity-50 pointer-events-none"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
                <div className="flex justify-end mb-4 px-4 sm:px-0">
                    <LanguageSwitcher />
                </div>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="mx-auto w-16 h-16 bg-agri-700 rounded-2xl flex items-center justify-center shadow-xl shadow-agri-700/30"
                >
                    <span className="text-white text-3xl">🌱</span>
                </motion.div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                    {t('login')}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t('tagline')}
                </p>
            </div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10"
            >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl py-8 px-4 shadow-2xl dark:shadow-gray-900/50 sm:rounded-3xl sm:px-8 border border-gray-100 dark:border-gray-700">

                    <div className="flex justify-center space-x-4 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('Farmer')}
                            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${role === 'Farmer'
                                ? 'bg-agri-50 text-agri-700 border-2 border-agri-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:bg-agri-900/40 dark:text-agri-300'
                                : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                }`}
                        >
                            <span>👨‍🌾</span> {t('farmer')}
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('Shopkeeper')}
                            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${role === 'Shopkeeper'
                                ? 'bg-agri-50 text-agri-700 border-2 border-agri-500 shadow-[0_0_15px_rgba(34,197,94,0.3)] dark:bg-agri-900/40 dark:text-agri-300'
                                : 'bg-gray-50 text-gray-500 border-2 border-transparent hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                }`}
                        >
                            <span>🏪</span> {t('shopkeeper')}
                        </button>
                    </div>

                    <form className="space-y-2" onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('phone')}
                            </label>
                            <input
                                type="text"
                                name="identifier"
                                required
                                value={formData.identifier}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-agri-500 focus:border-transparent outline-none transition-all dark:text-white"
                                placeholder="user@example.com / +91..."
                            />
                        </div>

                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            showForgotPassword={true}
                        />

                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium border border-red-100 dark:border-red-800">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 mt-8 border border-transparent rounded-xl shadow-[0_4px_14px_0_rgba(34,197,94,0.39)] text-sm font-medium text-white bg-agri-500 hover:bg-agri-600 hover:shadow-[0_6px_20px_rgba(34,197,94,0.23)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agri-500 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? '...' : `${t('login')} (${t(role.toLowerCase())})`}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-agri-600 hover:text-agri-500 dark:text-agri-400 transition-colors">
                            Register here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
