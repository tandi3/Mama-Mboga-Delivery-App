#!/bin/bash
# Start script for Render deployment

cd server
gunicorn --bind 0.0.0.0:$PORT app:app