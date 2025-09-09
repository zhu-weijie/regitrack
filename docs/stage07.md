### **Architecture-as-Code (AaC) Artifacts:**

#### **1. Logical View (C4 Component Diagram)**

This diagram is updated to show that the `Backend API` now has a dependency on a dedicated secrets management system.

```mermaid
C4Component
  title Component Diagram for RegiTrack with Secrets Management

  Person(admin, "Administrator", "Views and manages vehicle data.")
  
  System_Boundary(regitrack, "RegiTrack System") {
    Container(frontend, "Frontend Service", "React served by Nginx", "Serves the static UI assets.")
    Container(backend, "Backend API", "Node.js, Express", "Handles business logic and data access.")
    ContainerDb(db, "Relational Database", "PostgreSQL", "Stores vehicle registration data.")
  }

  System_Ext(monitoring, "Observability Platform", "AWS CloudWatch")
  System_Ext(secrets, "Secrets Manager", "AWS Secrets Manager", "Provides secure storage and retrieval of database credentials.")
  System_Ext(aws, "Amazon Web Services", "Hosts the running RegiTrack system.")

  Rel(admin, frontend, "Uses", "HTTPS")
  Rel(frontend, backend, "Makes API calls to", "JSON/HTTPS")
  Rel(backend, db, "Reads from and writes to", "SQL/TCP")
  Rel(backend, secrets, "Fetches Credentials from")
  
  Rel(frontend, monitoring, "Sends Logs & Metrics to")
  Rel(backend, monitoring, "Sends Logs & Metrics to")
```

#### **2. Physical View (AWS Deployment Diagram)**

This diagram shows the new `Secrets Manager` service and the crucial `IAM Policy` that grants the API tasks permission to access it.

```mermaid
graph TD
  subgraph "AWS Cloud"
    Secrets[AWS Secrets Manager]
    
    subgraph "IAM"
      Role[ECS Task Execution Role]
      Policy["IAM Policy<br>(Allow Secret Read)"]
      Role -- "has policy attached" --> Policy
    end

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
        DB[AWS RDS Database]
      end

      ALB --> NginxTaskA
      ALB --> NginxTaskB

      NginxTaskA -- "/api" --> ApiTaskA
      NginxTaskB -- "/api" --> ApiTaskB
      
      ApiTaskA -- "SQL" --> DB
      ApiTaskB -- "SQL" --> DB
      
      ApiTaskA -- "Outbound" --> NAT
      ApiTaskB -- "Outbound" --> NAT
      
      %% --- Corrected Security Relationships ---
      ApiTaskA -- "assumes" --> Role
      ApiTaskB -- "assumes" --> Role
      Policy -- "grants access to" --> Secrets
    end
  end
  User[Internet User] --> ALB
```

#### **3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| **(Secret Storage)** | **AWS Secrets Manager** | **A fully managed, highly secure service for storing credentials with built-in encryption, access control, and auditing.** |
| Backend API | AWS ECS Fargate Service | (Rationale unchanged) |
| Frontend Service | AWS ECS Fargate Service | (Rationale unchanged) |
| Relational Database | AWS RDS | (Rationale unchanged) |
| Observability Platform | AWS CloudWatch | (Rationale unchanged) |
