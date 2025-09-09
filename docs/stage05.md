**Architecture-as-Code (AaC) Artifacts:**

**1. Logical View (C4 Component Diagram)**
```mermaid
C4Component
  title Component Diagram for RegiTrack with Managed Database

  Person(admin, "Administrator", "Views and manages vehicle data.")
  
  System_Boundary(regitrack, "RegiTrack System") {
    Container(frontend, "Frontend Service", "React served by Nginx", "Serves the static UI assets.")
    Container(backend, "Backend API", "Node.js, Express", "Handles business logic and data access.")
    ContainerDb(db, "Relational Database", "PostgreSQL", "Stores vehicle registration and de-registration data.")
  }

  System_Ext(aws, "Amazon Web Services", "Hosts the running RegiTrack system.")

  Rel(admin, frontend, "Uses", "HTTPS")
  Rel(frontend, backend, "Makes API calls to", "JSON/HTTPS")
  Rel(backend, db, "Reads from and writes to", "SQL/TCP")
```

**2. Physical View (AWS Deployment Diagram)**
```mermaid
graph TD
  subgraph "AWS Cloud"
    ECR[ECR Repositories]
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

      %% Internal traffic from Nginx to API
      NginxTaskA -- "/api requests" --> ApiTaskA
      NginxTaskB -- "/api requests" --> ApiTaskB
      
      %% Internal traffic from API to Database
      ApiTaskA -- "SQL" --> DB
      ApiTaskB -- "SQL" --> DB
      
      %% Outbound traffic from private API tasks to the internet
      ApiTaskA -- "Outbound to ECR etc." --> NAT
      ApiTaskB -- "Outbound to ECR etc." --> NAT
      NAT --> ECR
    end
  end
  User[Internet User] --> ALB
```

**3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| Relational Database | AWS RDS (e.g., PostgreSQL) | Fully managed, highly available, and secure database service. |
