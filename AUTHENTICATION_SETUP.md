# Authentication Setup Guide

This guide covers email verification for the medical clinic website (email/password auth only).

## Email Verification Setup

### Gmail Setup (Recommended)

1. **Enable 2-Step Verification** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update `backend/.env`**:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-character-app-password
   EMAIL_FROM=no-reply@yourdomain.com
   FRONTEND_URL=http://localhost:3000
   ```

### Other Email Providers

- **Outlook/Hotmail**: Use `smtp-mail.outlook.com` on port 587
- **Yahoo**: Use `smtp.mail.yahoo.com` on port 587
- **Custom SMTP**: Update `SMTP_HOST` and `SMTP_PORT` accordingly

## Testing

1. Register a new user
2. Check your inbox for the verification link
3. Click the link to verify email
4. Log in with email and password

## Important Notes

- Email verification is required before users can access the dashboard
- Never commit `.env` files to version control
- Use a strong, unique `JWT_SECRET` in production (min 32 characters)
- Use HTTPS in production

## Troubleshooting

### Email not sending?
- Confirm 2-Step Verification and App Password are set for Gmail
- Check `SMTP_USER` / `SMTP_PASS` in `.env`
- Restart the backend after changing `.env`

### Login fails after register?
- Verify the account via the email link first
- Confirm `FRONTEND_URL` matches your running frontend
