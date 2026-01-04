# Authentication Setup Guide

This guide will help you set up email verification and Google OAuth authentication for the medical clinic website.

## 📧 Email Verification Setup

### Gmail Setup (Recommended)

1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update `.env` file**:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-16-character-app-password
   EMAIL_FROM_NAME=MediCare Clinic
   ```

### Other Email Providers

- **Outlook/Hotmail**: Use `smtp-mail.outlook.com` on port 587
- **Yahoo**: Use `smtp.mail.yahoo.com` on port 587
- **Custom SMTP**: Update `EMAIL_HOST` and `EMAIL_PORT` accordingly

## 🔐 Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google+ API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 Credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add Authorized redirect URIs:
     - `http://localhost:5000/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)
   - Copy the **Client ID** and **Client Secret**

### Step 2: Update Environment Variables

Add to your `backend/.env` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 3: Update Frontend URL

Make sure `FRONTEND_URL` in backend `.env` matches your frontend URL:
```env
FRONTEND_URL=http://localhost:3000  # Development
# or
FRONTEND_URL=https://yourdomain.com  # Production
```

## 🚀 Testing

### Test Email Verification

1. Register a new user
2. Check your email inbox for verification link
3. Click the link to verify email
4. Try logging in (should work after verification)

### Test Google OAuth

1. Click "Continue with Google" on login page
2. Select your Google account
3. Grant permissions
4. You should be redirected back to the dashboard

## ⚠️ Important Notes

- **Email verification is required** before users can log in with email/password
- **Google OAuth users** are automatically verified (Google emails are pre-verified)
- **Password is optional** for Google OAuth users
- Make sure to update all environment variables before deploying to production
- Use strong, unique secrets for `JWT_SECRET` and `SESSION_SECRET` in production

## 🔒 Security Best Practices

1. Never commit `.env` files to version control
2. Use environment variables for all sensitive data
3. Rotate secrets regularly in production
4. Use HTTPS in production
5. Set up proper CORS policies
6. Enable rate limiting (already configured)

## 📝 Troubleshooting

### Email not sending?
- Check if 2-Step Verification is enabled
- Verify app password is correct
- Check spam folder
- Verify SMTP settings match your email provider

### Google OAuth not working?
- Verify redirect URI matches exactly in Google Console
- Check that Google+ API is enabled
- Ensure Client ID and Secret are correct
- Check browser console for errors

### Email verification link expired?
- Links expire after 24 hours
- Use "Resend verification email" option
- Or register again with the same email

