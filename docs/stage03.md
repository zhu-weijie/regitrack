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
    subgraph "Development & SCM"
        Dev[Developer] -- "git push" --> Repo[GitHub Repository]
    end

    subgraph "CI/CD Platform"
        Repo -- Triggers --> GHA[GitHub Actions Pipeline]
    end

    subgraph "AWS Cloud"
        ECR[ECR Repositories]
        ECS[ECS Fargate Services]
    end

    GHA -- "Build & Push" --> ECR
    GHA -- "Update Service" --> ECS
```

**3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| (CI/CD Pipeline) | GitHub Actions | Tightly integrated with the source code repository. Generous free tier. |
