# RegiTrack - Vehicle Registration Management

RegiTrack is a full-stack web application designed for administrators to view, filter, and manage vehicle registration and de-registration data. It provides a modern, responsive interface with both list and calendar views for intuitive data visualization.

## Features

-   **Dual Views:** View data in a comprehensive List View or a monthly/yearly Calendar View.
-   **Status Visualization:** Vehicle statuses (`REGISTERED`, `DEREGISTERED`) are clearly distinguished with color-coded chips.
-   **Detailed Modal:** Click on any vehicle in any view to see a detailed information modal.
-   **Advanced Filtering:** Filter the entire dataset by status, vehicle type (5-seat/7-seat), and class (Personal/Commercial).
-   **Responsive Design:** The UI is fully responsive, providing a seamless experience on both desktop and mobile devices.
-   **Themed UI:** A professional and consistent user interface built with a custom Material-UI theme.

## Tech Stack

-   **Frontend:** React, TypeScript, Vite, Material-UI (MUI)
-   **Backend:** Node.js, Express, TypeScript
-   **Monorepo:** `pnpm` workspaces
-   **Containerization:** Docker & Docker Compose
-   **Infrastructure as Code:** Terraform
-   **Cloud Provider:** Amazon Web Services (AWS)
-   **CI/CD:** GitHub Actions
-   **AWS Services:** VPC, Subnets, ECS, Fargate, ECR, Application Load Balancer, IAM

## Local Development

1.  Ensure you have Docker Desktop and `pnpm` installed.
2.  Clone the repository.
3.  From the project root, run the development environment:
    ```bash
    docker compose up --build
    ```
4.  The frontend will be available at `http://localhost:5173`.
5.  The backend API will be available at `http://localhost:3000`.

## Production Deployment

The project is configured for automated deployment to AWS via a unified CI/CD pipeline using GitHub Actions.

1.  The infrastructure is defined in the `/terraform` directory and can be provisioned with `terraform apply`.
2.  The GitHub Actions workflow in `.github/workflows/main.yml` handles automated building, testing, and deployment.
3.  Deployments to the `main` branch will automatically update the running services on AWS ECS.
