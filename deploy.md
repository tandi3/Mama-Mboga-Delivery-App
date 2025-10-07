# Deployment Guide

## Heroku Deployment

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create mama-mboga-app`
4. Set environment variables:
   ```
   heroku config:set SECRET_KEY=your-production-secret-key
   heroku config:set DATABASE_URL=your-database-url
   ```
5. Deploy: `git push heroku main`

## Netlify Deployment (Frontend)

1. Build client: `cd client && npm run build`
2. Deploy build folder to Netlify
3. Set environment variables in Netlify dashboard

## Railway Deployment

1. Connect GitHub repo to Railway
2. Set environment variables
3. Deploy automatically on push