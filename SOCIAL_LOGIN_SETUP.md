# Social Login Setup Guide

## Overview
This project now supports Google, Facebook, and Apple social login with both real API integration and mock fallback for development.

## Setup Instructions

### 1. Google OAuth 2.0 Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized origins: `http://localhost:3000`, `https://yourdomain.com`
6. Set authorized redirect URIs: `http://localhost:3000/pages/login-signup.html`
7. Copy the Client ID and replace `YOUR_GOOGLE_CLIENT_ID` in `api.js`

### 2. Facebook Login Setup

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to "Facebook Login" → "Settings"
5. Add valid OAuth redirect URIs: `http://localhost:3000/pages/login-signup.html`
6. Copy the App ID and replace `YOUR_FACEBOOK_APP_ID` in `login-signup.html`

### 3. Apple Sign In Setup

1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create a new App ID with "Sign In with Apple" capability
3. Create a Service ID for web authentication
4. Configure domains and redirect URLs
5. Copy the Client ID and replace `YOUR_APPLE_CLIENT_ID` in `login-signup.html`

## File Structure

```
src/assets/js/
├── api.js          # Social login API handlers
├── auth.js         # Authentication logic
└── utils.js        # Utility functions

src/pages/
└── login-signup.html # Login/signup page with SDKs
```

## How It Works

### Development Mode (Mock)
- If real social login fails, falls back to mock data
- Mock users are predefined in `api.js`
- Perfect for testing without API setup

### Production Mode (Real APIs)
- Uses actual Google, Facebook, Apple APIs
- Requires proper API credentials
- Handles real user authentication

## Testing

1. **Mock Mode**: Works immediately, uses predefined test users
2. **Real Mode**: Requires API setup, uses actual social accounts

## API Endpoints

The system expects a backend API at `https://api.pawfectcare.com/auth/social-login`:

```javascript
POST /auth/social-login
{
  "provider": "google|facebook|apple",
  "userData": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://...",
    "accessToken": "...",
    "provider": "google"
  }
}
```

## Troubleshooting

### Common Issues

1. **SDK not loading**: Check internet connection and SDK URLs
2. **CORS errors**: Ensure domains are properly configured in OAuth settings
3. **Invalid credentials**: Verify API keys and client IDs
4. **Mock fallback**: Check console for "using mock" messages

### Debug Mode

Enable debug logging by opening browser console. All social login attempts are logged with detailed information.

## Security Notes

- Never commit real API keys to version control
- Use environment variables for production
- Implement proper token validation on backend
- Use HTTPS in production
- Validate all user data from social providers
