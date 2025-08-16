# 1. Create a private ECR repository for the API image
resource "aws_ecr_repository" "api" {
  name                 = "regitrack-api"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "regitrack-api-repo"
  }
}

# 2. Create a private ECR repository for the Nginx/Client image
resource "aws_ecr_repository" "nginx" {
  name                 = "regitrack-nginx"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "regitrack-nginx-repo"
  }
}

# 3. Create the ECS Cluster
# This acts as a logical grouping for our services.
resource "aws_ecs_cluster" "main" {
  name = "regitrack-cluster"

  tags = {
    Name = "regitrack-cluster"
  }
}
