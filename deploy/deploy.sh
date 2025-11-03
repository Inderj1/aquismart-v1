#!/bin/bash

# Deployment script for AcquiSmart on EC2
# Run this from /var/www/acquismart

set -e

echo "====== Deploying AcquiSmart ======"

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install --legacy-peer-deps

# Build frontend
echo "Building frontend..."
npm run build

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend/svc-catalog
npm install --legacy-peer-deps
cd ../..

# Create logs directory
mkdir -p logs

# Restart PM2 processes
echo "Restarting PM2 processes..."
pm2 delete all || true
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup

echo ""
echo "====== Deployment Complete ======"
echo "Frontend: https://www.acquismart.ai"
echo "Backend API: https://www.acquismart.ai/api"
echo ""
echo "Check status: pm2 status"
echo "View logs: pm2 logs"
echo ""
