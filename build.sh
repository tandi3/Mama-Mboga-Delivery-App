#!/bin/bash
# Build script for Render deployment

echo "Installing Python dependencies..."
pip install -r server/requirements.txt

echo "Installing Node.js dependencies..."
cd client
npm install

echo "Building React app..."
npm run build

echo "Build completed successfully!"