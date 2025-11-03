# Terraform Deployment for AcquiSmart

Automated deployment of AcquiSmart on AWS EC2 t2.micro using Terraform.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **Terraform** installed ([Download](https://www.terraform.io/downloads))
3. **AWS CLI** configured with credentials
4. **SSH key pair** generated

## Quick Start

### 1. Generate SSH Key (if you don't have one)

```bash
ssh-keygen -t rsa -b 4096 -f ~/.ssh/acquismart-key -N ""
```

### 2. Configure Terraform Variables

Create `terraform.tfvars`:

```hcl
ssh_public_key = "ssh-rsa AAAAB3... your-public-key-here"
ssh_allowed_ips = ["YOUR.IP.ADDRESS/32"]  # Your IP for SSH access
aws_region = "us-east-1"
```

### 3. Initialize Terraform

```bash
cd terraform
terraform init
```

### 4. Review the Plan

```bash
terraform plan
```

### 5. Deploy

```bash
terraform apply
```

Type `yes` when prompted. Terraform will create:
- EC2 t2.micro instance
- Security Group (SSH, HTTP, HTTPS)
- Elastic IP
- Key Pair
- Automated setup via user_data script

### 6. Get Outputs

```bash
terraform output
```

You'll see:
- Public IP address
- SSH command
- DNS configuration instructions
- Next steps

## Post-Deployment Steps

### 1. Configure DNS

Point your domain to the Elastic IP:

```
A Record: acquismart.ai → <ELASTIC_IP>
A Record: www.acquismart.ai → <ELASTIC_IP>
```

### 2. Wait for Setup to Complete

SSH into the instance and monitor:

```bash
ssh -i ~/.ssh/acquismart-key.pem ubuntu@<ELASTIC_IP>
tail -f /var/log/cloud-init-output.log
```

Wait for "Setup Complete" message (~5-10 minutes).

### 3. Setup SSL Certificate

```bash
sudo certbot --nginx -d acquismart.ai -d www.acquismart.ai
```

Follow the prompts to:
- Enter email
- Agree to terms
- Choose redirect option (recommended: 2 - Redirect)

### 4. Verify Deployment

Visit https://www.acquismart.ai

Check services:
```bash
pm2 status
sudo systemctl status nginx
```

## Management

### View Logs

```bash
# Application logs
pm2 logs

# Nginx logs
sudo tail -f /var/log/nginx/error.log

# System logs
tail -f /var/log/user-data.log
```

### Restart Services

```bash
# Restart apps
pm2 restart all

# Restart Nginx
sudo systemctl restart nginx
```

### Update Application

```bash
cd /var/www/acquismart
./deploy/deploy.sh
```

## Terraform Commands

```bash
# Show current state
terraform show

# List resources
terraform state list

# Get outputs
terraform output

# Destroy infrastructure
terraform destroy
```

## Cost Optimization

- **t2.micro**: Free tier eligible (750 hours/month for 12 months)
- **EBS**: 20GB gp3 (~$1.60/month after free tier)
- **Data Transfer**: First 100GB/month free

**Estimated cost**: ~$0-5/month (within free tier limits)

## Troubleshooting

### Can't connect via SSH

- Check security group allows your IP
- Verify key permissions: `chmod 400 ~/.ssh/acquismart-key.pem`
- Check instance is running: `terraform show`

### Application not starting

```bash
# SSH into instance
ssh -i ~/.ssh/acquismart-key.pem ubuntu@<IP>

# Check user data log
tail -f /var/log/cloud-init-output.log

# Manually start if needed
cd /var/www/acquismart
pm2 start deploy/ecosystem.config.js
```

### SSL certificate issues

```bash
# Re-run certbot
sudo certbot --nginx -d acquismart.ai -d www.acquismart.ai

# Check certificate status
sudo certbot certificates
```

## Security Best Practices

1. **Restrict SSH access**:
   ```hcl
   ssh_allowed_ips = ["YOUR.IP.ADDRESS/32"]
   ```

2. **Enable automatic security updates**:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

3. **Set up monitoring**:
   - Enable CloudWatch
   - Configure PM2 monitoring
   - Set up uptime monitoring

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

Type `yes` when prompted. This will delete:
- EC2 instance
- Elastic IP
- Security Group
- Key Pair

## Files Structure

```
terraform/
├── main.tf          # Main infrastructure
├── variables.tf     # Input variables
├── outputs.tf       # Output values
├── user_data.sh     # Automated setup script
├── terraform.tfvars # Your configuration (gitignored)
└── README.md        # This file
```

## Support

For issues:
1. Check logs: `/var/log/cloud-init-output.log`
2. Verify DNS: `dig acquismart.ai`
3. Test services: `pm2 status && sudo nginx -t`
