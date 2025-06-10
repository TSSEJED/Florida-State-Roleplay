require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { verifyLoginCode } = require('../FSRP Bot/utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Verify login code endpoint
app.post('/api/verify-code', async (req, res) => {
    try {
        const { code, userId } = req.body;
        
        if (!code || !userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'Code and userId are required' 
            });
        }
        
        const result = verifyLoginCode(code, userId);
        
        if (!result.valid) {
            return res.status(400).json({ 
                success: false, 
                message: result.message 
            });
        }
        
        // Code is valid, return success with user data
        res.json({
            success: true,
            userId: result.userId,
            expiresAt: result.expiresAt
        });
        
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});

module.exports = app;
