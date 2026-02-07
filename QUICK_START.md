# ⚡ Quick Start - Authentication Setup

## 🎯 Goal
Get your new authentication system running in **5 minutes**.

---

## 📝 Step-by-Step

### 1. Install Dependencies (2 min)

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Update Database (1 min)

```bash
cd server
npx prisma generate
npx prisma db push
cd ..
```

### 3. Setup Environment Variables (2 min)

#### Frontend `.env`
```env
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
NEXT_PUBLIC_GOOGLE_CLIENT_ID="PASTE_YOUR_GOOGLE_CLIENT_ID_HERE"
```

#### Backend `server/.env`
```env
DATABASE_URL="postgresql://user:password@localhost:5432/startupops?schema=public"
JWT_SECRET="your-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="PASTE_YOUR_GOOGLE_CLIENT_ID_HERE"
GOOGLE_CLIENT_SECRET="PASTE_YOUR_GOOGLE_CLIENT_SECRET_HERE"
GOOGLE_REDIRECT_URI="http://localhost:3001/api/auth/google/callback"

# Email OTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="StartupOps <noreply@startupops.com>"
```

---

## 🔑 Get Your Credentials

### Google OAuth (Required)

1. Go to: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth Client ID (Web application)
4. Add authorized origins:
   - `http://localhost:3000`
   - `http://localhost:3001`
5. Add redirect URI:
   - `http://localhost:3001/api/auth/google/callback`
6. Copy **Client ID** and **Client Secret**

### Gmail App Password (Required for OTP)

1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" → "Other" → Name it "StartupOps"
4. Copy the 16-character password

---

## 🚀 Start the App

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## ✅ Test It

1. Open: http://localhost:3000/login
2. You should see:
   - ✅ Google sign-in button
   - ✅ OTP Code / Password tabs
3. Try signing in with Google
4. Try OTP authentication

---

## 🐛 Troubleshooting

**Google button not showing?**
→ Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in frontend `.env`

**OTP email not sending?**
→ Verify Gmail App Password in backend `.env`
→ Make sure it's 16 characters with no spaces

**Database error?**
→ Run `cd server && npx prisma db push`

---

## 📚 Need More Help?

- **Full Guide**: See `AUTH_SETUP_GUIDE.md`
- **Environment Variables**: See `ENV_VARIABLES_CHECKLIST.md`
- **What Changed**: See `AUTHENTICATION_CHANGES.md`

---

## 🎉 You're Done!

Your authentication system is now live with:
- ✅ Google OAuth
- ✅ Email OTP
- ✅ Password Auth

Users can choose their preferred sign-in method!
