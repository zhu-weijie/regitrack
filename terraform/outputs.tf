output "vpc_id" {
  description = "The ID of the main VPC"
  value       = aws_vpc.main.id
}

output "public_subnet_ids" {
  description = "A list of the public subnet IDs"
  value       = [aws_subnet.public_a.id, aws_subnet.public_b.id]
}

output "api_ecr_repository_url" {
  description = "The URL of the API ECR repository"
  value       = aws_ecr_repository.api.repository_url
}

output "nginx_ecr_repository_url" {
  description = "The URL of the Nginx ECR repository"
  value       = aws_ecr_repository.nginx.repository_url
}

output "ecs_cluster_name" {
  description = "The name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_security_group_id" {
  description = "The ID of the ECS service security group"
  value       = aws_security_group.ecs_service.id
}

output "alb_dns_name" {
  description = "The public DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "lb_target_group_arn" {
  description = "The ARN of the main LB Target Group"
  value       = aws_lb_target_group.main.arn
}

output "ecs_task_execution_role_arn" {
  description = "The ARN of the ECS task execution role"
  value       = aws_iam_role.ecs_task_execution_role.arn
}
