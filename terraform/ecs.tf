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

# 4. Create a Security Group for our Fargate services
resource "aws_security_group" "ecs_service" {
  name        = "regitrack-ecs-service-sg"
  description = "Allow HTTP inbound traffic for RegiTrack ECS services"
  vpc_id      = aws_vpc.main.id

  # Allow inbound HTTP traffic from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "regitrack-ecs-service-sg"
  }
}

# 5. Create the Application Load Balancer (ALB)
resource "aws_lb" "main" {
  name               = "regitrack-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_service.id]
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = {
    Name = "regitrack-alb"
  }
}

# 6. Create a Target Group for the ALB
# The target group is where our ECS service will register its containers
resource "aws_lb_target_group" "main" {
  name        = "regitrack-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip" # Required for Fargate

  health_check {
    path = "/"
  }
}

# 7. Create a Listener for the ALB
# This rule forwards all traffic from port 80 on the ALB to our target group
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.main.arn
  }
}
