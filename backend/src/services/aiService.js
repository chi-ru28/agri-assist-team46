const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const config = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const { OpenAI } = require('openai');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
// Basic fallback for langdetect if needed, though langdetect-node is standard
const langdetect = require('langdetect');

const genAI = new GoogleGenerativeAI(config.ai.geminiApiKey);
const openai = new OpenAI({ apiKey: config.ai.openaiApiKey });
const generateChatResponse = async (role, userMessage, weatherWarning = '') => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let systemPrompt = '';
        if (role === 'farmer') {
            systemPrompt = `You are "AgriAssist", a professional agriculture AI assistant built to support farmers.

Your expertise includes:
- Crop selection
- Soil health
- Irrigation management
- Fertilizer recommendation
- Pest and disease management
- Weather advisory
- Government agriculture schemes

Rules:
- Give answers suitable for Indian farming conditions unless user specifies another country.
- Answer only agriculture-related questions.
- Provide practical, step-by-step advice.
- Use simple language so that rural farmers can understand easily. Avoid complex technical jargon unless necessary.
- If uncertain, clearly state it. Do not generate false information.
- If outside agriculture, politely refuse and say: "I am designed to assist only with agriculture-related queries."
- Prefer sustainable and safe farming practices.
- Never provide harmful chemical misuse advice, illegal pesticide usage, financial or medical advice unrelated to farming, or political opinions.

Response format:
1. Explanation
2. Recommended Actions
3. Precautions
4. Additional Support (if relevant / Government schemes)`;
        } else if (role === 'shopkeeper') {
            systemPrompt = `You are ShopAssist, an intelligent retail shop assistant chatbot.

Your expertise:
- Product information
- Price and availability
- Offers and discounts
- Order tracking
- Return and refund policies
- Store details

Rules:
- Respond politely and professionally.
- Keep answers short and helpful.
- Suggest alternatives if product unavailable.
- Stay strictly within shop-related queries.
- If unsure, suggest contacting the store.
- If outside shopping or store-related topics, politely say: "I am designed to assist only with shop-related queries."
- Never provide financial advice, medical advice, illegal product guidance, or political opinions.

Response Structure:
1. Direct Answer
2. Recommendation
3. Offer/Additional Info`;
        } else {
            systemPrompt = `You are a neutral assistant for AgriAssist. Answer queries concisely within the bounds of agricultural information.`;
        }

        let detectedLang = 'en';
        try {
            const detected = langdetect.detect(userMessage);
            if (detected && detected.length > 0) {
                detectedLang = detected[0].lang;
            }
        } catch (e) {
            logger.warn('Language detection failed, defaulting to English', e);
        }

        systemPrompt += `\n\nLanguage Requirement:
1. You MUST respond in the SAME language as the user's input.
2. If the input is in Hindi (hi), use simple rural Hindi, avoid overly Sanskritized vocabulary.
3. If the input is in Gujarati (gu), use simple conversational Gujarati, farmer-friendly vocabulary, avoid heavy literary Gujarati.
4. If the input is mixed, respond in the dominant language.
5. Provide structured reasoning: Problem, Cause, Solution, Prevention.
6. End with: 'Let me know if you need more help.'
7. Keep sentences clear, short and natural for text-to-speech without special characters or emojis.`;

        if (weatherWarning) {
            systemPrompt += `\nCRITICAL CONTEXT: ${weatherWarning}. Prioritize addressing this weather warning immediately in your advice if relevant.`;
        }

        const prompt = `${systemPrompt}\n\nUser Question: ${userMessage}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;

        const responseText = response.text();

        // Generate Audio for the response
        const audioResponse = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: responseText,
        });

        const audioFileName = `${uuidv4()}.mp3`;
        // Save to a public or static folder so frontend can access
        // Ensure this directory exists in your app setup (e.g., backend/public/audio)
        const audioDir = path.join(__dirname, '..', '..', 'public', 'audio');
        if (!fs.existsSync(audioDir)) {
            fs.mkdirSync(audioDir, { recursive: true });
        }
        const audioFilePath = path.join(audioDir, audioFileName);

        const buffer = Buffer.from(await audioResponse.arrayBuffer());
        await fs.promises.writeFile(audioFilePath, buffer);

        // For advanced token tracking parsing if needed natively from response block
        return {
            text: responseText,
            audioUrl: `/audio/${audioFileName}`,
            detectedLanguage: detectedLang,
            // Assuming a generic token count structure mock for the record
            tokensUsed: prompt.length + responseText.length
        };
    } catch (error) {
        logger.error('AI Service Error (Chat):', error);

        // Fallback mock response so the UI remains responsive if the API key is leaked or invalid
        let fallbackText = "I'm currently offline and unable to process your request.";
        const msgText = (userMessage || '').toLowerCase();

        if (role === 'farmer') {
            if (msgText.includes('fertilizer')) {
                fallbackText = `👨‍🌾 Note (Offline Mode): For your query regarding "${userMessage}", a general rule is to use standard NPK composts. Please wait for the AI to come back online for precise dosage.`;
            } else if (msgText.includes('pest') || msgText.includes('disease') || msgText.includes('detect')) {
                fallbackText = `👨‍🌾 Note (Offline Mode): To address "${userMessage}", consider an organic neem oil spray as a temporary solution until I can process the specific symptoms.`;
            } else if (msgText.includes('weather')) {
                fallbackText = `👨‍🌾 Note (Offline Mode): I see you're asking about weather ("${userMessage}"). Make sure to check local forecasts or use the Weather Info action on your right.`;
            } else {
                fallbackText = `👨‍🌾 Note (Offline Mode): I received your input: "${userMessage}". Unfortunately, I am offline due to an API error and can only offer general advice right now.`;
            }
        } else if (role === 'shopkeeper') {
            if (msgText.includes('stock') || msgText.includes('inventory')) {
                fallbackText = `🏪 Note (Offline Mode): Regarding your stock query "${userMessage}", ensure you have enough core seeds and top-selling fertilizers before peak season.`;
            } else if (msgText.includes('price') || msgText.includes('sell') || msgText.includes('demand')) {
                fallbackText = `🏪 Note (Offline Mode): For your query "${userMessage}", it's recommended to analyze competitor local pricing until I am back online to calculate profit margins.`;
            } else {
                fallbackText = `🏪 Note (Offline Mode): I received your input: "${userMessage}". It's recommended to maintain a steady inventory while analyzing local buying trends since I am currently offline.`;
            }
        }

        if (weatherWarning) {
            fallbackText += `\n\n⚠️ Also, take note of the weather: ${weatherWarning}`;
        }

        return {
            text: fallbackText,
            tokensUsed: 0
        };
    }
};

const fileToGenerativePart = (filePath, mimeType) => {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
            mimeType
        },
    };
};

const analyzeImage = async (filePath, mimeType) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Act as an elite crop pathologist. Analyze this plant/crop image. Detect any deficiency or disease immediately.
    You MUST respond with ONLY a raw JSON string using the EXACT structure below. Do not use block-ticks or markdown.
    {
      "deficiency": "Name of deficiency/disease",
      "severity": "Low, Medium, or High",
      "recommendedFertilizer": "Suggested fertilizer/chemical name",
      "dosagePerAcre": "Amount",
      "precautions": "Safety notes",
      "healthScore": 0-100 (integer)
    }`;

        const imageParts = [fileToGenerativePart(filePath, mimeType)];
        const result = await model.generateContent([prompt, ...imageParts]);
        let responseText = await result.response.text();

        // Fallback JSON sanitization
        responseText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();

        const parsedData = JSON.parse(responseText);

        // Delete temporary file to save IO operations later instead of keeping
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        return parsedData;
    } catch (error) {
        logger.error("AI Service Error (Vision):", error);
        // Cleanup if fail
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        // Fallback mock JSON so the frontend remains responsive instead of crashing
        return {
            deficiency: "[Offline Mode] Unable to Analyze",
            severity: "Unknown",
            recommendedFertilizer: "Please contact local agronomist.",
            dosagePerAcre: "N/A",
            precautions: "Service is currently offline due to an API error.",
            healthScore: 50
        };
    }
};

const generateMultimodalChatResponse = async (role, userMessage, file, weatherWarning = '') => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        let systemPrompt = `You are a helpful AI agriculture and shop assistant. Analyze the image and the user's message.`;
        if (role === 'farmer') {
            systemPrompt = `You are "AgriAssist", a professional agriculture AI assistant built to support farmers. Analyze the attached crop/plant image and answer the user's question. If asked to diagnose, provide deficiency/disease insights, recommended actions, and precautions. Keep answers rural-farmer friendly.`;
        } else if (role === 'shopkeeper') {
            systemPrompt = `You are ShopAssist, a retail assistant. Analyze the attached product/inventory image and the user's query. Provide relevant stock, condition, or management advice.`;
        }

        if (weatherWarning) {
            systemPrompt += `\nCRITICAL CONTEXT: ${weatherWarning}.`;
        }

        const prompt = `${systemPrompt}\nUser Message: ${userMessage}`;

        // Read file directly from path provided by Multer
        const imagePart = fileToGenerativePart(file.path, file.mimetype);

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = await result.response.text();

        // Cleanup temporary image
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }

        // Parse language similarly to standard text
        let detectedLang = 'en';
        try {
            const detected = langdetect.detect(userMessage || responseText);
            if (detected && detected.length > 0) detectedLang = detected[0].lang;
        } catch (e) { }

        // Optionally generate audio if needed
        const audioResponse = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: responseText.slice(0, 4000), // truncation for TTS
        });
        const audioFileName = `${uuidv4()}.mp3`;
        const audioDir = path.join(__dirname, '..', '..', 'public', 'audio');
        if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
        const audioFilePath = path.join(audioDir, audioFileName);
        const buffer = Buffer.from(await audioResponse.arrayBuffer());
        await fs.promises.writeFile(audioFilePath, buffer);

        return {
            text: responseText,
            audioUrl: `/audio/${audioFileName}`,
            detectedLanguage: detectedLang,
            tokensUsed: prompt.length + responseText.length,
            analysis: null // can parse structured JSON if strictly needed, but conversational is fine
        };
    } catch (error) {
        logger.error("AI Service Error (Multimodal Chat):", error);
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return {
            text: "I'm sorry, I couldn't analyze the image right now due to a system error.",
            tokensUsed: 0
        };
    }
};

module.exports = {
    generateChatResponse,
    analyzeImage,
    generateMultimodalChatResponse
};
