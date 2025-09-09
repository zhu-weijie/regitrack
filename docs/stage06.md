**Architecture-as-Code (AaC) Artifacts:**

**1. Logical View (C4 Component Diagram)**
```mermaid
C4Component
  title Component Diagram for RegiTrack with Observability

  Person(admin, "Administrator", "Views and manages vehicle data.")
  
  System_Boundary(regitrack, "RegiTrack System") {
    Container(frontend, "Frontend Service", "React served by Nginx", "Serves the static UI assets.")
    Container(backend, "Backend API", "Node.js, Express", "Handles business logic and data access.")
    ContainerDb(db, "Relational Database", "PostgreSQL", "Stores vehicle registration data.")
  }

  System_Ext(monitoring, "Observability Platform", "AWS CloudWatch", "Collects logs and metrics for monitoring and alerting.")
  System_Ext(aws, "Amazon Web Services", "Hosts the running RegiTrack system.")

  Rel(admin, frontend, "Uses", "HTTPS")
  Rel(frontend, backend, "Makes API calls to", "JSON/HTTPS")
  Rel(backend, db, "Reads from and writes to", "SQL/TCP")
  
  Rel(frontend, monitoring, "Sends Logs & Metrics to")
  Rel(backend, monitoring, "Sends Logs & Metrics to")
```

**2. Physical View (AWS Deployment Diagram)**
```mermaid
graph TD
  subgraph "AWS Cloud"
    subgraph "Observability & Alerting"
      CW_Logs[CloudWatch Log Groups]
      CW_Metrics[CloudWatch Metrics]
      CW_Alarms[CloudWatch Alarms]
      SNS[SNS Topic: Operations Team]
      
      CW_Metrics --> CW_Alarms
      CW_Alarms -- "sends notification" --> SNS
    end

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

      NginxTaskA -- "/api" --> ApiTaskA
      NginxTaskB -- "/api" --> ApiTaskB
      
      ApiTaskA -- "SQL" --> DB
      ApiTaskB -- "SQL" --> DB
      
      %% --- Simplified & Corrected Outbound Paths ---
      %% Public tasks send telemetry directly
      NginxTaskA -- "Logs & Metrics" --> CW_Logs
      NginxTaskB -- "Logs & Metrics" --> CW_Metrics
      ALB -- "Metrics" --> CW_Metrics

      %% Private tasks send ALL outbound traffic via NAT Gateway
      ApiTaskA -- "Outbound Traffic (Logs, Metrics, ECR Pull)" --> NAT
      ApiTaskB -- "Outbound Traffic (Logs, Metrics, ECR Pull)" --> NAT
      NAT --> ECR
      NAT --> CW_Logs
      NAT --> CW_Metrics
    end
  end
  User[Internet User] --> ALB
```

**3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| (Logging) | AWS CloudWatch Logs | Native, serverless log aggregation for ECS. |
| (Monitoring) | AWS CloudWatch Metrics | Default, high-quality metrics for all AWS services. |
| (Alerting) | AWS CloudWatch Alarms & SNS | Native, reliable alerting mechanism. |
