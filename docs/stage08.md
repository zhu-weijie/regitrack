### **Architecture-as-Code (AaC) Artifacts:**

#### **1. Logical View (C4 Component Diagram)**

The logical view is updated to show that the CI/CD pipeline now has a direct, privileged relationship with the database to manage its schema.

```mermaid
C4Component
  title Component Diagram for RegiTrack with Database Migrations

  Person(admin, "Administrator", "Views and manages vehicle data.")
  
  System_Boundary(regitrack, "RegiTrack System") {
    Container(frontend, "Frontend Service", "React served by Nginx")
    Container(backend, "Backend API", "Node.js, Express")
    ContainerDb(db, "Relational Database", "PostgreSQL", "Stores vehicle data; schema is version-controlled.")
  }

  System_Ext(cicd, "CI/CD Pipeline", "GitHub Actions", "Builds, migrates, and deploys the system.")
  System_Ext(aws, "Amazon Web Services")

  Rel(admin, frontend, "Uses")
  Rel(frontend, backend, "Makes API calls to")
  Rel(backend, db, "Reads from and writes to")
  
  Rel(cicd, db, "Applies Schema Migrations to")
  Rel(cicd, aws, "Deploys to")
```

#### **2. Physical View (AWS Deployment Diagram)**

This diagram shows the new `Migration Task` as part of the CI/CD process. This is a short-lived task that runs within our VPC to gain access to the private database.

```mermaid
graph TD
  subgraph "CI/CD Platform (GitHub Actions)"
    A[Build & Test Job] --> B[Migration Job];
    B -- "on success" --> C[Deploy Job];
  end

  subgraph "AWS Cloud"
    subgraph "VPC"
      subgraph "Private Subnets"
        DB[AWS RDS Database]
        MigrateTask["ECS Fargate Task<br>(short-lived migration runner)"]
      end
    end
    
    subgraph "Running Application"
      ECS["ECS Services (API + Nginx)"]
    end
  end

  B -- "runs" --> MigrateTask;
  MigrateTask -- "applies schema changes" --> DB;
  C -- "updates" --> ECS;
```

#### **3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| **(Schema Management)** | **ECS Fargate "Run Task"** | **A mechanism to run a short-lived, one-off containerized task (the migration script) with secure access to the private network and database.** |
| Backend API | AWS ECS Fargate Service | (Rationale unchanged) |
| Frontend Service | AWS ECS Fargate Service | (Rationale unchanged) |
| Relational Database | AWS RDS | (Rationale unchanged) |
