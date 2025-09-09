**Architecture-as-Code (AaC) Artifacts:**

**1. Logical View (C4 Component Diagram)**
*(No change to the logical view, as this is a physical implementation detail)*

**2. Physical View (AWS Deployment Diagram)**
```mermaid
graph TD
  subgraph "AWS Cloud"
    ECR
    subgraph "VPC"
      subgraph "Public Subnets"
        ALB[Application Load Balancer]
        NAT[NAT Gateway]
      end
      subgraph "Private Subnets"
        ApiTaskA["ECS Task (API)"]
        ApiTaskB["ECS Task (API)"]
      end
      subgraph "Public Subnets " 
        NginxTaskA["ECS Task (Nginx)"]
        NginxTaskB["ECS Task (Nginx)"]
      end
      
      ALB --> NginxTaskA
      ALB --> NginxTaskB
      NginxTaskA -- "/api" --> ALB
      
      ALB -- "Internal Traffic" --> ApiTaskA
      ALB -- "Internal Traffic" --> ApiTaskB
      ApiTaskA -- "Outbound" --> NAT
      ApiTaskB -- "Outbound" --> NAT
      NAT --> ECR
    end
  end
  User --> ALB
```

**3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| Backend API | AWS ECS Fargate Service in **Private Subnets** | Protects the API from direct internet access. |
| (Outbound Access) | AWS NAT Gateway | Provides a secure way for private resources to access the internet. |
