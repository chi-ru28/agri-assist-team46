const express = require('express');
const router = express.Router();
const multer = require('multer');
const hybridController = require('../controllers/hybridController');

// We use multer memory storage to pass the file buffer directly to the Python server 
// without needing to save it to disk locally first.
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Upload Limit
});

// POST /api/hybrid-analysis
// Using `.single('image')` parses multipart/form-data. If it's a JSON body, req.file is null and req.body triggers.
router.post('/hybrid-analysis', upload.single('image'), hybridController.processHybridAnalysis);

module.exports = router;
