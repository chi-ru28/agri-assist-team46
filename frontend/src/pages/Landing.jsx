import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Mic, Globe, ShieldCheck, ArrowRight, Activity, CloudSun, Users } from 'lucide-react';

export const Landing = () => {
    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const floatAnimation = {
        y: [0, -10, 0],
        transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
    };

    const featureCards = [
        { icon: <Leaf className="text-agri-500" size={32} />, title: "Smart Crop Insights", desc: "Get real-time AI recommendations for fertilizers and crop health." },
        { icon: <Mic className="text-blue-500" size={32} />, title: "Voice Supported", desc: "Speak directly to AgriAssist in local languages for hands-free help." },
        { icon: <Activity className="text-orange-500" size={32} />, title: "Market Demand", desc: "Shopkeepers can analyze current local trends and restock smartly." },
        { icon: <ShieldCheck className="text-green-600" size={32} />, title: "Secure Data", desc: "Enterprise-level security for your farms, inventory, and analytics." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans overflow-x-hidden selection:bg-agri-500 selection:text-white">

            {/* Navbar Overlay */}
            <nav className="fixed w-full z-50 py-4 px-6 md:px-12 flex justify-between items-center backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-100 dark:border-gray-800">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="w-10 h-10 bg-agri-500 rounded-xl flex items-center justify-center shadow-lg shadow-agri-500/30">
                        <span className="text-white font-bold text-xl">🌱</span>
                    </div>
                    <span className="font-bold text-2xl text-gray-800 dark:text-gray-100 tracking-tight">AgriAssist</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4"
                >
                    <Link to="/login" className="px-5 py-2.5 text-gray-700 dark:text-gray-200 font-medium hover:text-agri-600 dark:hover:text-agri-400 transition-colors hidden sm:block">
                        Sign In
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-full shadow-lg shadow-gray-900/20 dark:shadow-white/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        Get Started <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center pt-20 px-4 md:px-12 sm:pt-0">
                {/* Background Visuals */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Abstract shapes / gradients mimicking a "video" feel, or an actual video */}
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute w-full h-full object-cover opacity-20 dark:opacity-[0.15] mix-blend-luminosity grayscale"
                    >
                        <source src="https://cdn.pixabay.com/video/2019/04/18/22880-331580880_tiny.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-gray-900/80 dark:to-gray-900" />
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-agri-400/20 dark:bg-agri-900/30 blur-[100px]"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-400/20 dark:bg-blue-900/30 blur-[100px]"
                    />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-agri-50 dark:bg-agri-900/50 border border-agri-200 dark:border-agri-800 text-agri-700 dark:text-agri-300 font-medium text-sm mb-6 shadow-sm"
                    >
                        <Globe size={16} /> <span>Built for modern agriculture</span>
                    </motion.div>

                    <motion.h1
                        initial="hidden" animate="visible" variants={fadeIn}
                        className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-[1.1] mb-6"
                    >
                        Empowering Farmers <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-agri-500 to-green-400">
                            Through AI Intelligence
                        </span>
                    </motion.h1>

                    <motion.p
                        initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Connect directly to an advanced AI designed to help you analyze soil, track weather, buy resources, and predict demand effortlessly.
                    </motion.p>

                    <motion.div
                        initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4"
                    >
                        <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-agri-500 hover:bg-agri-600 text-white font-semibold rounded-2xl shadow-lg shadow-agri-500/40 hover:shadow-xl hover:shadow-agri-500/50 hover:-translate-y-1 transition-all flex justify-center items-center gap-2 text-lg">
                            Start Your Journey <ArrowRight size={20} />
                        </Link>
                        <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex justify-center items-center text-lg">
                            Sign In
                        </Link>
                    </motion.div>

                    {/* Floating UI Elements indicating activity */}
                    <motion.div animate={floatAnimation} className="absolute hidden lg:flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 -left-12 top-20">
                        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-xl text-blue-500"><CloudSun size={24} /></div>
                        <div className="text-left"><p className="text-sm font-bold dark:text-gray-100">Weather Alert</p><p className="text-xs text-gray-500 dark:text-gray-400">Rain expected at 4 PM</p></div>
                    </motion.div>

                    <motion.div animate={floatAnimation} transition={{ delay: 1 }} className="absolute hidden lg:flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 -right-4 bottom-10">
                        <div className="bg-orange-100 dark:bg-orange-900/50 p-2 rounded-xl text-orange-500"><Users size={24} /></div>
                        <div className="text-left"><p className="text-sm font-bold dark:text-gray-100">Market Demand</p><p className="text-xs text-gray-500 dark:text-gray-400">Wheat seed demand up 12%</p></div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid Section */}
            <section className="py-24 px-6 md:px-12 relative z-10 bg-gray-50 dark:bg-gray-900/50">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">A complete ecosystem</h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Everything you need to modernize your agricultural workflow.</p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        {featureCards.map((feat, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeIn}
                                whileHover={{ y: -10 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-gray-50 dark:border-gray-700"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center mb-6 shadow-inner">
                                    {feat.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feat.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feat.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Footer minimal */}
            <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                <p>© 2026 AgriAssist. All rights reserved.</p>
            </footer>
        </div>
    );
};
