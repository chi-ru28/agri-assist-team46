const mlService = require('../services/mlService');
const aiService = require('../services/aiService');

/**
 * Handle POST /api/hybrid-analysis
 * Directs traffic to the correct ML Model (Image vs Tabular) and then routes output to Gemini LLM
 */
exports.processHybridAnalysis = async (req, res) => {
    try {
        let mlResult;
        let analysisType;

        // 1. Route: Image Prediction (File Uploaded)
        if (req.file) {
            // Validate Image Type 
            if (!req.file.mimetype.startsWith('image/')) {
                return res.status(400).json({ success: false, message: 'Invalid file type. Please upload an image.' });
            }

            analysisType = 'image_analysis';
            // Send file buffer to Python API
            mlResult = await mlService.predictImage(req.file.buffer, req.file.originalname);
        }

        // 2. Route: Fertilizer Prediction (JSON Body)
        else if (req.body && (req.body.N || req.body.temperature)) {
            analysisType = 'soil_analysis';

            // Validate required tabular inputs
            const { N, P, K, temperature, humidity, cropType } = req.body;
            if (N == null || P == null || K == null || !temperature || !humidity || !cropType) {
                return res.status(400).json({ success: false, message: 'Missing required soil parameters (N, P, K, temperature, humidity, cropType)' });
            }

            // Send payload to Python API
            mlResult = await mlService.predictFertilizer({ N, P, K, temperature, humidity, cropType });
        }

        // 3. Route Error: Bad Request Structure
        else {
            return res.status(400).json({
                success: false,
                message: 'Provide either an image file for disease detection OR a JSON payload for fertilizer recommendation.'
            });
        }

        // 4. Send structured ML output to Gemini AI for natural language augmentation
        const finalAdvisory = await aiService.generateAdvisory(mlResult, analysisType);

        // 5. Final Client Response
        return res.status(200).json({
            success: true,
            data: finalAdvisory
        });

    } catch (error) {
        console.error('Hybrid Architecture Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error during AI/ML analysis.',
            error: error.message
        });
    }
};
