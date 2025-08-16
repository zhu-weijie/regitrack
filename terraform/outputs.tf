output "vpc_id" {
  description = "The ID of the main VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "A list of the public subnet IDs"
  value       = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}
