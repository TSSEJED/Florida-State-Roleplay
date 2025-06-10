// Copy this file to config.js and update the values below

// Configuration for the training request system
const config = {
    // Discord OAuth2 - Get these from Discord Developer Portal
    DISCORD_CLIENT_ID: 'YOUR_DISCORD_CLIENT_ID',
    DISCORD_REDIRECT_URI: 'YOUR_DISCLOUD_APP_URL/auth/discord/callback',
    
    // API Endpoints - Update with your Discloud app URL
    API_BASE_URL: 'YOUR_DISCLOUD_APP_URL/api',
    
    // Webhook URLs - Create these in your Discord server settings
    WEBHOOKS: {
        SUBMISSIONS: 'https://discord.com/api/webhooks/...',
        APPROVED: 'https://discord.com/api/webhooks/...',
        DENIED: 'https://discord.com/api/webhooks/...'
    },
    
    // UI Settings
    APP_NAME: 'FSRP Training System',
    
    // Discord role names with admin access
    ADMIN_ROLES: ['Admin', 'Staff Manager'],
    
    // Theme colors
    THEME: {
        primary: '#4a6fa5',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    }
};

// Make config available globally
window.appConfig = config;
