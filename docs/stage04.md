**Architecture-as-Code (AaC) Artifacts:**

**1. Logical View (C4 Component Diagram)**
```mermaid
C4Component
  title Component Diagram for RegiTrack with CI/CD

  Person(admin, "Administrator", "Views and manages vehicle data.")
  
  System_Boundary(regitrack, "RegiTrack System") {
    Container(frontend, "Frontend Service", "React served by Nginx", "Serves the static UI assets.")
    Container(backend, "Backend API", "Node.js, Express", "Provides vehicle data via a REST API.")
  }

  System_Ext(data, "Vehicle Data Store", "Embedded CSV Files")
  System_Ext(cicd, "CI/CD Pipeline", "GitHub Actions", "Automates the building and deployment of the system.")
  System_Ext(aws, "Amazon Web Services", "Hosts the running RegiTrack system.")

  Rel(admin, frontend, "Uses", "HTTPS")
  Rel(frontend, backend, "Makes API calls to", "JSON/HTTP")
  Rel(backend, data, "Reads from")
  
  Rel(cicd, aws, "Deploys to")
```

**2. Physical View (AWS Deployment Diagram)**
```mermaid
graph TD
  subgraph "AWS Cloud"
    ECR
    subgraph "VPC"
      subgraph "Public Subnets"
        ALB[Application Load Balancer]
        NAT[NAT Gateway]
        NginxTaskA["ECS Task (Nginx)"]
        NginxTaskB["ECS Task (Nginx)"]
      end
      subgraph "Private Subnets"
        ApiTaskA["ECS Task (API)"]
        ApiTaskB["ECS Task (API)"]
      end
      
      User[Internet User] --> ALB
      ALB --> NginxTaskA
      ALB --> NginxTaskB

      %% Internal service-to-service communication
      NginxTaskA -- "/api requests" --> ApiTaskA
      NginxTaskB -- "/api requests" --> ApiTaskB
      
      %% Outbound traffic from private subnets
      ApiTaskA -- "Outbound to ECR" --> NAT
      ApiTaskB -- "Outbound to ECR" --> NAT
      NAT --> ECR
    end
  end
```

**3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| Backend API | AWS ECS Fargate Service in **Private Subnets** | Protects the API from direct internet access. |
| (Outbound Access) | AWS NAT Gateway | Provides a secure way for private resources to access the internet. |
