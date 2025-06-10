// Store login codes in memory
// In a production environment, you might want to use a database
const loginCodes = new Map();

// Clean up expired codes every 5 minutes
setInterval(() => {
    const now = new Date();
    for (const [code, data] of loginCodes.entries()) {
        if (data.expiresAt < now || data.used) {
            loginCodes.delete(code);
        }
    }
}, 5 * 60 * 1000);

// Function to verify a login code
function verifyLoginCode(code, userId) {
    const data = loginCodes.get(code);
    
    // Check if code exists, isn't used, and isn't expired
    if (!data || data.used || data.expiresAt < new Date()) {
        return { valid: false, message: 'Invalid or expired code' };
    }
    
    // Check if the code belongs to the user
    if (data.userId !== userId) {
        return { valid: false, message: 'This code does not belong to you' };
    }
    
    // Mark code as used
    data.used = true;
    
    return { 
        valid: true, 
        userId: data.userId,
        expiresAt: data.expiresAt
    };
}

module.exports = {
    loginCodes,
    verifyLoginCode
};
