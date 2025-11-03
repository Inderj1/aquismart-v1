variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "ssh_public_key" {
  description = "SSH public key for EC2 access"
  type        = string
}

variable "ssh_allowed_ips" {
  description = "List of IPs allowed to SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"] # Change to your IP for better security
}

variable "github_repo" {
  description = "GitHub repository URL"
  type        = string
  default     = "https://github.com/Inderj1/aquismart-v1.git"
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = "acquismart.ai"
}
