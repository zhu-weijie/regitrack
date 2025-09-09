**Architecture-as-Code (AaC) Artifacts:**

**1. Logical View (C4 Component Diagram)**
```mermaid
C4Component
  Person(admin, "Administrator")
  System_Boundary(regitrack_mvp, "RegiTrack MVP") {
    Container(monolith, "Monolithic Service", "Node.js, Express, React", "Serves both the UI and the API. Reads from local CSV files.")
  }
  Rel(admin, monolith, "Uses", "HTTPS")
```

**2. Physical View (AWS Deployment Diagram)**
```mermaid
graph TD
  subgraph "AWS Cloud"
    subgraph "VPC"
      subgraph "Public Subnet"
        Task["ECS Fargate Task <br> (Monolith Container)"]
      end
    end
  end
  User[Internet User] --> Task
```

**3. Component-to-Resource Mapping Table**

| Logical Component | Physical Resource | Rationale |
| :--- | :--- | :--- |
| Monolithic Service | AWS ECS Fargate Task | A simple, serverless way to run a single container. |
