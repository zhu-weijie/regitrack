**Architecture-as-Code (AaC) Artifacts:**

**1. Logical View (C4 Component Diagram)**
```mermaid
C4Component
  Person(admin, "Administrator")
  System_Boundary(regitrack, "RegiTrack System") {
    Container(frontend, "Frontend Service", "React served by Nginx", "Serves the static UI assets.")
    Container(backend, "Backend API", "Node.js, Express", "Provides vehicle data via a REST API.")
  }
  System_Ext(data, "Vehicle Data Store", "Embedded CSV Files")

  Rel(admin, frontend, "Uses", "HTTPS")
  Rel(frontend, backend, "Makes API calls to", "JSON/HTTP")
  Rel(backend, data, "Reads from")
```

**2. Physical View (AWS Deployment Diagram)**
```mermaid
graph TD
  subgraph "AWS Cloud"
    ALB[Application Load Balancer]
    ECR[ECR Repositories]
    subgraph "VPC"
      subgraph "Public Subnet A"
        NginxTaskA["ECS Task (Nginx)"]
        ApiTaskA["ECS Task (API)"]
      end
      subgraph "Public Subnet B"
        NginxTaskB["ECS Task (Nginx)"]
        ApiTaskB["ECS Task (API)"]
      end
    end
  end

  User[Internet User] --> ALB
  
  %% ALB only talks to Nginx
  ALB --> NginxTaskA
  ALB --> NginxTaskB

  %% Nginx proxies traffic to the API service
  NginxTaskA -- "/api requests" --> ApiTaskA
  NginxTaskB -- "/api requests" --> ApiTaskB
  
  %% Tasks pull images from ECR
  NginxTaskA -- "Pulls image" --> ECR
  ApiTaskA -- "Pulls image" --> ECR
  NginxTaskB -- "Pulls image" --> ECR
  ApiTaskB -- "Pulls image" --> ECR
```

**3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| Frontend Service | AWS ECS Fargate Service (Nginx) | Serverless container orchestration for the web server. |
| Backend API | AWS ECS Fargate Service (Node.js) | Independent, serverless scaling for the API. |
| (Load Balancer) | AWS Application Load Balancer | Manages traffic, enables scaling and HA. |
| (Image Storage) | AWS Elastic Container Registry | Secure, managed storage for Docker images. |
