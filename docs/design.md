# RegiTrack - Architectural Design

This document outlines the architecture and design of the RegiTrack application using various diagrams.

### High-Level Architecture Diagram

This diagram shows the overall flow of traffic from the user to the running services on AWS.

```mermaid
graph TD
    A[User] --> B{Internet};
    B --> C[Application Load Balancer];
    C --> E[Nginx Container];
    E -- Serves UI --> A;
    E -- /api requests --> F[API Container];
    F -- Reads data --> G[CSV Files];
```

### C4 Component Diagram

This diagram shows the major components within the RegiTrack system.

```mermaid
C4Component
  Person(admin, "Administrator", "Views and manages vehicle data.")
  
  System_Boundary(regitrack, "RegiTrack Application") {
    Container(frontend, "Frontend", "React, TypeScript", "The single-page application providing the UI.")
    Container(backend, "Backend API", "Node.js, Express", "Provides vehicle data via a REST API.")
    ContainerDb(data, "Vehicle Data", "CSV Files", "Stores the raw registration data.")
  }
  
  System_Ext(aws, "Amazon Web Services", "Provides cloud infrastructure for hosting.")

  Rel(admin, frontend, "Uses", "HTTPS")
  Rel(frontend, backend, "Makes API calls to", "JSON/HTTPS")
  Rel(backend, data, "Reads from")
```

### Sequence Diagram (API Request Flow)

This diagram illustrates the sequence of events when a user loads the application.

```mermaid
sequenceDiagram
  participant User
  participant Browser
  participant Nginx
  participant API
  
  User->>Browser: Navigates to the application URL
  Browser->>Nginx: GET / (Request main page)
  Nginx-->>Browser: Returns index.html, JS, CSS
  
  Browser->>Nginx: GET /api/vehicles
  Nginx->>API: Forwards request
  activate API
  API->>API: loadAllVehicles()
  API-->>Nginx: Returns JSON array of vehicles
  deactivate API
  Nginx-->>Browser: Relays JSON response
  
  Browser->>User: Renders the vehicle list
```

### Class Diagram (Backend)

This diagram shows the logical structure of the backend's data handling.

```mermaid
classDiagram
  class Vehicle {
    +string uuid
    +string status
    +string start_date
    +string brand
    +string type
    +string vehicle_class
  }

  class DataService {
    -Vehicle[] allVehicles
    +loadAllVehicles() void
    +getAllVehicles() Vehicle[]
  }
  
  DataService "1" -- "0..*" Vehicle : Caches
```

### Entity Relationship Diagram (ERD)

This ERD shows the logical relationship between the data sources and the vehicle records.

```mermaid
erDiagram
  CSV_FILE {
    string name
    string type
  }

  VEHICLE {
    string uuid
    string status
    string start_date
    string brand
  }

  CSV_FILE ||--o{ VEHICLE : "contains"
```

### State Diagram (ECS Task Lifecycle)

This diagram shows the states an ECS Fargate task transitions through during a deployment.

```mermaid
stateDiagram-v2
  [*] --> PENDING
  PENDING --> RUNNING : Image pull successful
  RUNNING --> DRAINING : New deployment started
  DRAINING --> STOPPED : Connections finished
  PENDING --> STOPPED : Image pull failed
  RUNNING --> STOPPED : Container crashed
```

### User Journey Map

This map outlines the typical journey of an administrator using the application.

```mermaid
journey
  title Admin's Journey to Find a Vehicle
  section Data Visualization
    View Dashboard: 5: admin
    Switch to Calendar: 4: admin
  section Data Analysis
    Filter by 'Deregistered': 5: admin
    Filter by 'Ford': 4: admin
  section Investigation
    Click on a specific vehicle: 5: admin
    Review details in modal: 5: admin
```

### Cloud Infrastructure Diagram

The relationships between the VPC, Subnets, Internet Gateway, Load Balancer, and the ECS services.

```mermaid
graph TD
    %% Define all nodes and their groupings first
    subgraph "AWS Cloud (us-east-1)"
        subgraph "VPC (10.0.0.0/16)"
            IGW[Internet Gateway]
            ALB[Application Load Balancer]

            subgraph "Public Subnet A (us-east-1a)"
                TaskA["ECS Task (nginx + api)"]
            end

            subgraph "Public Subnet B (us-east-1b)"
                TaskB["ECS Task (nginx + api)"]
            end
        end

        ECR[ECR Repositories]
    end

    %% Define all relationships at the end
    User[Internet User] --> ALB
    ALB --> TaskA
    ALB --> TaskB
    
    TaskA -- "Pulls Image" --> ECR
    TaskB -- "Pulls Image" --> ECR
    
    %% The route to the internet is via the IGW
    TaskA -- "Outbound Traffic" --> IGW
    TaskB -- "Outbound Traffic" --> IGW
```

### CI/CD Pipeline Diagram

```mermaid
graph TD
    subgraph "GitHub Repository"
        A[Push to any branch] --> PR{Pull Request};
        M[Merge to main] --> PUSH_MAIN[Push to main];
    end

    subgraph "GitHub Actions"
        PR --> B[Build and Test Job];
        PUSH_MAIN --> B;
        B -- on success --> D{Deploy Job?};
        D -- Yes (is push to main) --> E[Deploy to AWS];
        D -- No (is PR) --> F[Stop];
    end

    subgraph "AWS"
        E --> ECR[Push Docker Images];
        ECR --> ECS[Update ECS Services];
    end
```

### Data Flow Diagram (DFD)

The path data takes from its source, through processing steps, to its destination.

```mermaid
graph TD
    subgraph "Data Sources"
        DS[CSV Files]
    end

    subgraph "RegiTrack System"
        P1(1.0<br>Load & Cache Data);
        P2(2.0<br>Filter & Serve Data);
    end

    subgraph "User Interface"
        UI[Browser/Client]
    end

    DS -- "Raw Vehicle Records" --> P1;
    P1 -- "Cached Vehicle Objects" --> P2;
    P2 -- "Filtered JSON Payload" --> UI;
    UI -- "User Filter Criteria" --> P2;
```
