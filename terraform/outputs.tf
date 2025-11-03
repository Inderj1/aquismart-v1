output "instance_id" {
  description = "EC2 instance ID"
  value       = aws_instance.acquismart.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.acquismart_eip.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.acquismart.public_dns
}

output "ssh_command" {
  description = "SSH command to connect to the instance"
  value       = "ssh -i ~/.ssh/acquismart-key.pem ubuntu@${aws_eip.acquismart_eip.public_ip}"
}

output "dns_configuration" {
  description = "DNS configuration instructions"
  value = <<-EOT

  Configure your DNS records:

  A Record: ${var.domain_name} -> ${aws_eip.acquismart_eip.public_ip}
  A Record: www.${var.domain_name} -> ${aws_eip.acquismart_eip.public_ip}

  EOT
}

output "next_steps" {
  description = "Next steps after deployment"
  value = <<-EOT

  Next Steps:
  1. Configure DNS (see dns_configuration output above)
  2. SSH into instance: ${format("ssh -i ~/.ssh/acquismart-key.pem ubuntu@%s", aws_eip.acquismart_eip.public_ip)}
  3. Wait for user_data script to complete (check: tail -f /var/log/cloud-init-output.log)
  4. Setup SSL: sudo certbot --nginx -d ${var.domain_name} -d www.${var.domain_name}
  5. Check deployment: https://www.${var.domain_name}

  EOT
}
