require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { verifyLoginCode } = require('../FSRP Bot/utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// Request logging
app.use(morgan('dev'));

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'https://florida-state-roleplay.pages.dev'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something broke!' });
});

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
