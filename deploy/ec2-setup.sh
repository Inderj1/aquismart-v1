#!/bin/bash

# EC2 t2.micro Setup Script for AcquiSmart
# Run this script on your EC2 instance after SSH

set -e

echo "====== AcquiSmart EC2 Setup ======"

# Update system
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install build essentials
sudo apt install -y build-essential

# Install PM2 globally
echo "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "Installing Nginx..."
sudo apt install -y nginx

# Create application directory
echo "Creating application directory..."
sudo mkdir -p /var/www/acquismart
sudo chown -R $USER:$USER /var/www/acquismart

# Clone repository (you'll need to set this up)
echo "Clone your repository to /var/www/acquismart"
echo "Example: cd /var/www/acquismart && git clone <your-repo-url> ."

echo ""
echo "====== Next Steps ======"
echo "1. Clone your repository to /var/www/acquismart"
echo "2. Copy nginx config: sudo cp /var/www/acquismart/deploy/nginx.conf /etc/nginx/sites-available/acquismart"
echo "3. Enable site: sudo ln -s /etc/nginx/sites-available/acquismart /etc/nginx/sites-enabled/"
echo "4. Remove default: sudo rm /etc/nginx/sites-enabled/default"
echo "5. Test nginx: sudo nginx -t"
echo "6. Restart nginx: sudo systemctl restart nginx"
echo "7. Run deployment: cd /var/www/acquismart && ./deploy/deploy.sh"
echo ""
