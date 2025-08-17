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

# --- THIS RESOURCE IS MODIFIED ---
# 4. Create a Security Group for the Application Load Balancer
resource "aws_security_group" "alb" {
  name        = "regitrack-alb-sg" # Renamed
  description = "Allow HTTP inbound traffic for RegiTrack ALB"
  vpc_id      = aws_vpc.main.id

  # Allow inbound HTTP traffic from anywhere (the internet)
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
    Name = "regitrack-alb-sg" # Renamed
  }
}

# --- NEW RESOURCE ---
# Create a dedicated Security Group for our Fargate services
resource "aws_security_group" "ecs_service" {
  name        = "regitrack-ecs-service-sg"
  description = "Allow traffic from the ALB for RegiTrack ECS services"
  vpc_id      = aws_vpc.main.id

  # Allow inbound traffic on any port ONLY from the ALB's security group
  ingress {
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb.id] # Source is the ALB SG
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
# --- END NEW RESOURCE ---

# --- THIS RESOURCE IS MODIFIED ---
# 5. Create the Application Load Balancer (ALB)
resource "aws_lb" "main" {
  name               = "regitrack-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id] # Use the new ALB SG
  subnets            = [aws_subnet.public_a.id, aws_subnet.public_b.id]

  tags = {
    Name = "regitrack-alb"
  }
}

# 6. Create a Target Group for the ALB
resource "aws_lb_target_group" "main" {
  name        = "regitrack-tg"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  # Add a more lenient health check configuration
  health_check {
    path                = "/"
    protocol            = "HTTP"
    port                = "traffic-port"
    healthy_threshold   = 2     # Becomes healthy after 2 successful checks
    unhealthy_threshold = 2     # Becomes unhealthy after 2 failed checks
    timeout             = 5     # Wait 5 seconds for a response
    interval            = 10    # Wait 10 seconds between checks
    matcher             = "200" # Expect a 200 OK status code
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

# 8. Create an IAM Role for ECS Task Execution
# This gives Fargate permission to pull images from ECR and write logs.
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "regitrack-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# 9. Define the API Task Definition
resource "aws_ecs_task_definition" "api" {
  family                   = "regitrack-api"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "regitrack-api",
      image     = aws_ecr_repository.api.repository_url,
      cpu       = 256,
      memory    = 512,
      essential = true,
      portMappings = [
        {
          containerPort = 3000,
          hostPort      = 3000
        }
      ]
      # --- THE LIFECYCLE BLOCK WAS INCORRECTLY PLACED INSIDE THIS JSON ---
    }
  ])

  # --- THIS IS THE CORRECT LOCATION FOR THE LIFECYCLE BLOCK ---
  lifecycle {
    ignore_changes = [
      container_definitions,
      cpu,
      memory,
    ]
  }
}

# 10. Define the Nginx Task Definition
resource "aws_ecs_task_definition" "nginx" {
  family                   = "regitrack-nginx"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "regitrack-nginx",
      image     = aws_ecr_repository.nginx.repository_url,
      cpu       = 256,
      memory    = 512,
      essential = true,
      portMappings = [
        {
          containerPort = 80,
          hostPort      = 80
        }
      ]
      # --- THE LIFECYCLE BLOCK WAS INCORRECTLY PLACED INSIDE THIS JSON ---
    }
  ])

  # --- THIS IS THE CORRECT LOCATION FOR THE LIFECYCLE BLOCK ---
  lifecycle {
    ignore_changes = [
      container_definitions,
      cpu,
      memory,
    ]
  }
}

# 11. Create the API Service
resource "aws_ecs_service" "api" {
  name            = "regitrack-api-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.api.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups  = [aws_security_group.ecs_service.id] # Use the new Service SG
    assign_public_ip = true
  }
}

# 12. Create the Nginx Service
resource "aws_ecs_service" "nginx" {
  name            = "regitrack-nginx-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.nginx.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups  = [aws_security_group.ecs_service.id] # Use the new Service SG
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.main.arn
    container_name   = "regitrack-nginx"
    container_port   = 80
  }

  depends_on = [aws_ecs_service.api]
}
