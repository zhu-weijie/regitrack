**Architecture-as-Code (AaC) Artifacts:**

**1. Logical View (C4 Component Diagram)**
```mermaid
C4Component
  // ... (existing components are unchanged) ...
  System_Ext(cicd, "CI/CD Pipeline", "GitHub Actions")
  System_Ext(aws, "Amazon Web Services")

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
