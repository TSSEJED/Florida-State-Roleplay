# FSRP Training Request System

This is the web interface for the FSRP Training Request System, which integrates with the FSRP Discord bot for authentication and notifications.

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd training-request
   ```

2. **Configure the application**
   - Copy `js/config.example.js` to `js/config.js`
   - Update the values in `config.js` with your Discord application details

3. **Configure Discord Application**
   - Create a new application at [Discord Developer Portal](https://discord.com/developers/applications)
   - Add a redirect URI: `YOUR_DOMAIN/auth/discord/callback`
   - Note your Client ID and create a Client Secret

4. **Set up webhooks**
   - Create webhooks in your Discord server for:
     - Application submissions
     - Approved applications
     - Denied applications
   - Add these webhook URLs to your `config.js`

5. **Deploy**
   - Host the files on any static file server
   - For production, ensure you have HTTPS enabled

## Development

- The system uses vanilla JavaScript with no build step required
- All API calls are made to the FSRP Bot backend
- Authentication is handled through Discord OAuth2

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Discord
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
DISCORD_REDIRECT_URI=your_redirect_uri

# Webhooks
WEBHOOK_SUBMISSIONS=your_webhook_url
WEBHOOK_APPROVED=your_webhook_url
WEBHOOK_DENIED=your_webhook_url
```

## Security Notes

- Never commit sensitive information to version control
- Use HTTPS in production
- Regularly rotate your Discord bot token and webhook URLs
- Set appropriate CORS headers if hosting the frontend separately from the backend
