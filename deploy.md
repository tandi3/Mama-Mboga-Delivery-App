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

### Database
1. Create PostgreSQL database
2. Copy connection string to backend environment variables