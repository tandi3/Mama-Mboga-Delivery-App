# Deployment Guide for Render Free Tier

## Prerequisites
- GitHub repository with your code
- Render account (free tier)

## Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Deploy on Render free tier"
git push origin main
```

### 2. Create Web Service on Render
1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select your repository
5. Configure the service:
   - **Name**: `mama-mboga-app`
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `./start.sh`
   - **Plan**: `Free`

### 3. Environment Variables
Add these environment variables in Render dashboard:
- `SECRET_KEY`: Generate a random string (e.g., use `python -c "import secrets; print(secrets.token_hex(32))"`)

### 4. Optional: Add Database (Free PostgreSQL)
1. Click "New" → "PostgreSQL"
2. Name: `mama-mboga-db`
3. Plan: `Free`
4. Copy the External Database URL
5. Add to web service as `DATABASE_URL` environment variable

### 5. Access Your App
- Full App: `https://mama-mboga-app.onrender.com`
- API Endpoints: `https://mama-mboga-app.onrender.com/api/*`

## Architecture
- Single web service (FREE)
- React build served as static files
- Flask API with `/api` prefix
- SQLite (default) or PostgreSQL (optional)

## Important Notes
- Free tier: 750 hours/month, sleeps after 15min inactivity
- First deployment: 10-15 minutes
- No Blueprint required (stays free)
- Database is optional for testing

## Troubleshooting
- Check build/deploy logs in Render dashboard
- Ensure build.sh and start.sh are executable
- Verify all dependencies in requirements.txt and package.json