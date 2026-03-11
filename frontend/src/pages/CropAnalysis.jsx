import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Upload, Camera, Leaf, AlertCircle, CheckCircle2, RefreshCw, X, Mic, MicOff, Info } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { speak, startVoiceInput } from '../utils/speechUtils';

const CropAnalysis = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [cropName, setCropName] = useState('');
    const [isListening, setIsListening] = useState(false);
    const fileInputRef = useRef(null);

    // Initial voice instruction
    useEffect(() => {
        if (!result && !isAnalyzing && !imageFile) {
            const welcomeMsg = i18n.language === 'hi' ? 'कृपया विश्लेषण के लिए अपनी फसल की एक तस्वीर अपलोड करें।' :
                i18n.language === 'gu' ? 'કૃપા કરીને વિશ્લેષણ માટે તમારા પાકનો ફોટો અપલોડ કરો.' :
                    'Please upload a photo of your crop for analysis.';
            speak(welcomeMsg, i18n.language);
        }
    }, [i18n.language, result, isAnalyzing, imageFile]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError(t('error_image_only') || 'Please select an image file.');
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setError('');
                // Prompt for crop name after image selection
                const cropMsg = i18n.language === 'hi' ? 'आप चाहें तो फसल का नाम बता सकते हैं।' :
                    i18n.language === 'gu' ? 'જો તમે ઈચ્છો તો પાકનું નામ જણાવી શકો છો.' :
                        'You can optionally tell me the name of the crop.';
                speak(cropMsg, i18n.language);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVoiceInput = () => {
        setIsListening(true);
        startVoiceInput(i18n.language, (transcript) => {
            setIsListening(false);
            setCropName(transcript);
        });
    };

    const clearImage = () => {
        setImagePreview(null);
        setImageFile(null);
        setResult(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const analyzeCrop = async () => {
        if (!imageFile) return;

        setIsAnalyzing(true);
        setError('');

        const analyzingMsg = i18n.language === 'hi' ? 'आपकी फसल का विश्लेषण किया जा रहा है। कृपया प्रतीक्षा करें।' :
            i18n.language === 'gu' ? 'તમારા પાકનું વિશ્લેષણ થઈ રહ્યું છે. કૃપા કરીને રાહ જુઓ.' :
                'Analyzing your crop. Please wait.';
        speak(analyzingMsg, i18n.language);

        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('crop_name', cropName || 'Unknown');

        try {
            const response = await api.post('/vision/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResult(response.data);

            const doneMsg = i18n.language === 'hi' ? `विश्लेषण पूरा हुआ। परिणाम: ${response.data.disease_name}` :
                i18n.language === 'gu' ? `વિશ્લેષણ પૂર્ણ થયું. પરિણામ: ${response.data.disease_name}` :
                    `Analysis complete. Result: ${response.data.disease_name}`;
            speak(doneMsg, i18n.language);

        } catch (err) {
            console.error("Analysis Error:", err);
            setError(err.response?.data?.detail || 'Failed to analyze the image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
                        <Leaf className="h-8 w-8 text-agri-500" />
                        {t('crop_analysis') || 'AI Crop Analysis'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('crop_analysis_subtitle') || 'Upload a photo of your crop to detect diseases and get treatment recommendations.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 h-fit"
                >
                    <div className="space-y-6">
                        {!imagePreview ? (
                            <div
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <div className="mx-auto w-16 h-16 bg-agri-50 dark:bg-agri-900/30 text-agri-600 dark:text-agri-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Camera className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {t('click_to_upload') || 'Click to upload or take a photo'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    JPG, PNG, max 5MB
                                </p>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                                <img
                                    src={imagePreview}
                                    alt="Crop Preview"
                                    className="w-full h-auto max-h-[400px] object-contain"
                                />
                                <button
                                    onClick={clearImage}
                                    className="absolute top-4 right-4 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/50 rounded-full shadow-lg transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('what_crop_is_this') || 'What crop is this? (Optional)'}
                            </label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={cropName}
                                    onChange={(e) => setCropName(e.target.value)}
                                    placeholder="e.g., Wheat, Tomato"
                                    className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-agri-500 outline-none transition-all dark:text-white"
                                />
                                <button
                                    onClick={handleVoiceInput}
                                    type="button"
                                    className={`absolute right-3 p-1.5 rounded-lg ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-400 hover:text-agri-500 hover:bg-gray-100 dark:hover:bg-gray-800'} transition-colors`}
                                >
                                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            onClick={analyzeCrop}
                            disabled={!imageFile || isAnalyzing}
                            className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 text-white font-medium shadow-lg transition-all ${!imageFile || isAnalyzing
                                    ? 'bg-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-agri-600 hover:bg-agri-700 shadow-agri-600/30 hover:shadow-agri-600/40 active:scale-[0.98]'
                                }`}
                        >
                            {isAnalyzing ? (
                                <>
                                    <RefreshCw className="h-5 w-5 animate-spin" />
                                    {t('analyzing') || 'Analyzing...'}
                                </>
                            ) : (
                                <>
                                    <Upload className="h-5 w-5" />
                                    {t('analyze_crop') || 'Analyze Crop Now'}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {result ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col h-full"
                        >
                            <div className={`p-6 text-white ${result.disease_name.toLowerCase().includes('healthy')
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                    : 'bg-gradient-to-br from-amber-500 to-red-500'
                                }`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-white/80 text-sm font-medium mb-1 uppercase tracking-wider">Analysis Status</p>
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            {result.disease_name}
                                        </h2>
                                    </div>
                                    <div className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm text-sm font-medium">
                                        {Math.round(result.confidence_score * 100)}% Match
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        Details
                                    </h3>
                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                        {result.analysis_result}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Recommended Treatment</h3>
                                        <p className="text-blue-800 dark:text-blue-200/80 text-sm leading-relaxed">
                                            {result.recommendation?.chemical || result.recommendation || 'No specific chemical treatment recommended.'}
                                        </p>
                                    </div>

                                    {(result.recommendation?.organic_alternative || result.organic_alternative) && (
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800/30">
                                            <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                                                <Leaf className="h-4 w-4" /> Organic Alternative
                                            </h3>
                                            <p className="text-green-800 dark:text-green-200/80 text-sm leading-relaxed">
                                                {result.recommendation?.organic_alternative || result.organic_alternative}
                                            </p>
                                        </div>
                                    )}

                                    {result.recommendation?.precautions && (
                                        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30">
                                            <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">Precautions</h3>
                                            <p className="text-amber-800 dark:text-amber-200/80 text-sm leading-relaxed">
                                                {result.recommendation.precautions}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 border border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                        >
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                                <Leaf className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Waiting for Photo
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                                Upload a clear, well-lit photo of the affected crop area to receive a detailed health analysis.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default CropAnalysis;
