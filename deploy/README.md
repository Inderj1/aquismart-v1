# EC2 Deployment Guide for AcquiSmart

Deploy both frontend and backend on AWS EC2 t2.micro instance at https://www.acquismart.ai

## Prerequisites

1. **AWS EC2 t2.micro instance** with Ubuntu 22.04 LTS
2. **Domain acquismart.ai** DNS configured to point to EC2 public IP
3. **Security Group** configured with:
   - Port 22 (SSH)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

## Step 1: Initial EC2 Setup

SSH into your EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Run the setup script:
```bash
# Download and run setup
curl -o ec2-setup.sh https://raw.githubusercontent.com/your-repo/main/deploy/ec2-setup.sh
chmod +x ec2-setup.sh
./ec2-setup.sh
```

## Step 2: Clone Repository

```bash
cd /var/www/acquismart
git clone https://github.com/your-username/your-repo.git .
```

## Step 3: Configure Domain DNS

Point your domain to EC2 IP:
```
A Record: acquismart.ai → Your-EC2-IP
A Record: www.acquismart.ai → Your-EC2-IP
```

## Step 4: Install SSL Certificate

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d acquismart.ai -d www.acquismart.ai
```

## Step 5: Configure Nginx

```bash
# Copy nginx config
sudo cp /var/www/acquismart/deploy/nginx.conf /etc/nginx/sites-available/acquismart

# Enable site
sudo ln -s /etc/nginx/sites-available/acquismart /etc/nginx/sites-enabled/

# Remove default
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

## Step 6: Deploy Application

```bash
cd /var/www/acquismart
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

## Verify Deployment

- **Frontend**: https://www.acquismart.ai
- **Backend API**: https://www.acquismart.ai/api/businesses/search

## Management Commands

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all

# Monitor
pm2 monit
```

## Update/Redeploy

```bash
cd /var/www/acquismart
./deploy/deploy.sh
```

## Auto-start on Reboot

PM2 will automatically restart your apps on system reboot (configured in deploy.sh).

## Troubleshooting

### Check Nginx logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check application logs
```bash
pm2 logs acquismart-frontend
pm2 logs acquismart-backend
```

### Restart everything
```bash
pm2 restart all
sudo systemctl restart nginx
```

## Cost Optimization

t2.micro free tier:
- 750 hours/month free for 12 months
- 1 vCPU, 1GB RAM
- Perfect for demo/MVP

## Notes

- Frontend runs on port 3000 (proxied via Nginx)
- Backend runs on port 3002 (proxied via Nginx at /api)
- SSL certificates auto-renew via Certbot
- PM2 ensures processes restart on crashes
