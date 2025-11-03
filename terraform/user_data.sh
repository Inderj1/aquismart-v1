#!/bin/bash

# User data script for EC2 instance automated setup
# This runs on first boot

set -e

exec > >(tee /var/log/user-data.log)
exec 2>&1

echo "====== Starting AcquiSmart Setup ======"
echo "Timestamp: $(date)"

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 20.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install build essentials
apt install -y build-essential git

# Install PM2 globally
echo "Installing PM2..."
npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
apt install -y nginx

# Install Certbot
echo "Installing Certbot..."
apt install -y certbot python3-certbot-nginx

# Create application directory
echo "Creating application directory..."
mkdir -p /var/www/acquismart
chown -R ubuntu:ubuntu /var/www/acquismart

# Clone repository
echo "Cloning repository..."
cd /var/www/acquismart
sudo -u ubuntu git clone ${github_repo} .

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd /var/www/acquismart
sudo -u ubuntu npm install --legacy-peer-deps

# Build frontend
echo "Building frontend..."
sudo -u ubuntu npm run build

# Install backend dependencies
echo "Installing backend dependencies..."
cd /var/www/acquismart/backend/svc-catalog
sudo -u ubuntu npm install --legacy-peer-deps

# Create logs directory
cd /var/www/acquismart
sudo -u ubuntu mkdir -p logs

# Configure Nginx
echo "Configuring Nginx..."
cp /var/www/acquismart/deploy/nginx.conf /etc/nginx/sites-available/acquismart
ln -sf /etc/nginx/sites-available/acquismart /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx

# Start PM2 processes
echo "Starting PM2 processes..."
cd /var/www/acquismart
sudo -u ubuntu pm2 start deploy/ecosystem.config.js
sudo -u ubuntu pm2 save
env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "====== Setup Complete ======"
echo "Timestamp: $(date)"
echo ""
echo "Next steps:"
echo "1. Configure DNS to point to this instance"
echo "2. Run: sudo certbot --nginx -d ${domain_name} -d www.${domain_name}"
echo "3. Access: https://www.${domain_name}"
