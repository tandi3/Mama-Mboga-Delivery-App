# Deployment Guide

## Render Deployment

### Backend (Flask API)
1. Go to Render Dashboard
2. Create new Web Service
3. Connect GitHub repo
4. Configure:
   - Build Command: `cd server && pip install -r requirements.txt`
   - Start Command: `cd server && gunicorn app:app`
   - Environment Variables:
     - `SECRET_KEY`: Generate random value
     - `DATABASE_URL`: Connect PostgreSQL database

### Frontend (React)
1. Create new Static Site
2. Connect same GitHub repo
3. Configure:
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`

### Database Setup
1. In Render Dashboard, click "New +" → "PostgreSQL"
2. Name: `mama-mboga-db`
3. Database Name: `mama_mboga`
4. User: `mama_mboga_user`
5. Click "Create Database"
6. Copy the "External Database URL" from database info page
7. In your backend web service:
   - Go to Environment tab
   - Add `DATABASE_URL` = paste the copied URL
8. Your app will auto-create tables on first run