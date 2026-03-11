/**
 * Utility functions for Speech-to-Text and Text-to-Speech
 * Optimized for farmer-friendly voice interactions
 */

/**
 * Text-to-Speech function
 * @param {string} text - The text to speak
 * @param {string} lang - ISO language code (en, hi, gu)
 */
export const speak = (text, lang = 'en') => {
    if (!window.speechSynthesis) return;

    // Stop any current speaking
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Map internal lang codes to BCP 47
    const langMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'gu': 'gu-IN'
    };

    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
};

/**
 * Speech-to-Text function
 * @param {string} lang - ISO language code (en, hi, gu)
 * @param {function} onResult - Callback with the transcript result
 * @returns {object} - The recognition instance for manual control
 */
export const startVoiceInput = (lang = 'en', onResult) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Your browser does not support voice recognition. Please try Chrome.");
        return null;
    }

    const recognition = new SpeechRecognition();

    const langMap = {
        'en': 'en-IN',
        'hi': 'hi-IN',
        'gu': 'gu-IN'
    };

    recognition.lang = langMap[lang] || 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
    };

    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
    };

    recognition.start();
    return recognition;
};
