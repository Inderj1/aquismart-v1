terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
}

provider "aws" {
  region = var.aws_region
}

# Get latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group
resource "aws_security_group" "acquismart_sg" {
  name        = "acquismart-sg"
  description = "Security group for AcquiSmart EC2 instance"

  # SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = var.ssh_allowed_ips
    description = "SSH access"
  }

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP access"
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS access"
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "All outbound traffic"
  }

  tags = {
    Name        = "acquismart-sg"
    Environment = var.environment
    Project     = "AcquiSmart"
  }
}

# Key Pair
resource "aws_key_pair" "acquismart_key" {
  key_name   = "acquismart-key"
  public_key = var.ssh_public_key

  tags = {
    Name        = "acquismart-key"
    Environment = var.environment
    Project     = "AcquiSmart"
  }
}

# EC2 Instance
resource "aws_instance" "acquismart" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.instance_type

  key_name               = aws_key_pair.acquismart_key.key_name
  vpc_security_group_ids = [aws_security_group.acquismart_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
  }

  user_data = templatefile("${path.module}/user_data.sh", {
    github_repo = var.github_repo
    domain_name = var.domain_name
  })

  tags = {
    Name        = "acquismart-ec2"
    Environment = var.environment
    Project     = "AcquiSmart"
  }

  lifecycle {
    create_before_destroy = true
  }
}

# Elastic IP
resource "aws_eip" "acquismart_eip" {
  instance = aws_instance.acquismart.id
  domain   = "vpc"

  tags = {
    Name        = "acquismart-eip"
    Environment = var.environment
    Project     = "AcquiSmart"
  }
}
