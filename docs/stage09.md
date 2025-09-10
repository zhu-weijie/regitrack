### **Architecture-as-Code (AaC) Artifacts:**

#### **1. Logical View (C4 Component Diagram)**

The logical view is updated to show that our containers now have a new, dynamic attribute: they are auto-scaling.

```mermaid
C4Component
  title Component Diagram for RegiTrack with Auto Scaling

  Person(admin, "Administrator", "Views and manages vehicle data.")
  
  System_Boundary(regitrack, "RegiTrack System") {
    Container(frontend, "Frontend Service", "React served by Nginx", "Serves static UI assets. Scales based on request count.")
    Container(backend, "Backend API", "Node.js, Express", "Handles business logic. Scales based on CPU utilization.")
    ContainerDb(db, "Relational Database", "PostgreSQL", "Stores vehicle registration data.")
  }

  System_Ext(monitoring, "Observability Platform", "AWS CloudWatch", "Provides the metrics that trigger scaling events.")
  System_Ext(aws, "Amazon Web Services")

  Rel(admin, frontend, "Uses")
  Rel(frontend, backend, "Makes API calls to")
  Rel(backend, db, "Reads from and writes to")
  
  Rel(frontend, monitoring, "Provides Metrics for Scaling")
  Rel(backend, monitoring, "Provides Metrics for Scaling")
```

#### **2. Physical View (AWS Deployment Diagram)**

This diagram shows the new auto scaling components and their relationship with CloudWatch alarms.

```mermaid
graph TD
  subgraph "AWS Cloud"
    subgraph "Observability & Control Plane"
      Metrics[CloudWatch Metrics]
      Alarms[CloudWatch Alarms]
      ScalingPolicy[ECS Auto Scaling Policies]
      
      Metrics --> Alarms
      Alarms -- "trigger" --> ScalingPolicy
    end

    subgraph "VPC"
      subgraph "Public Subnets"
        ALB[Application Load Balancer]
        NginxTasks["ECS Service (Nginx)<br>min: 2, max: 10"]
      end
      
      subgraph "Private Subnets"
        ApiTasks["ECS Service (API)<br>min: 2, max: 10"]
        DB[AWS RDS Database]
      end

      ALB --> NginxTasks
      NginxTasks -- "/api" --> ApiTasks
      ApiTasks -- "SQL" --> DB
      
      %% --- Auto Scaling Relationships ---
      ScalingPolicy -- "adds/removes tasks" --> NginxTasks
      ScalingPolicy -- "adds/removes tasks" --> ApiTasks

      ALB -- "sends metrics" --> Metrics
      NginxTasks -- "sends metrics" --> Metrics
      ApiTasks -- "sends metrics" --> Metrics
    end
  end
  User[Internet User] --> ALB
```

#### **3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| **(Service Resiliency)** | **AWS Application Auto Scaling** | **Natively integrated with ECS and CloudWatch. Provides a simple and powerful way to configure and manage elastic scaling for our containerized services.** |
| Backend API | AWS ECS Fargate Service | (Rationale unchanged) |
| Frontend Service | AWS ECS Fargate Service | (Rationale unchanged) |
| Relational Database | AWS RDS | (Rationale unchanged) |
