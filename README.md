# Omnes Marketplace

Welcome to the Omnes Marketplace project! This is a modern, full-stack application with a React/Vite frontend and a PHP backend, all orchestrated seamlessly with Docker.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: PHP (Slim Framework)
- **Database**: MySQL 8.0
- **Web Server**: Nginx
- **Infrastructure**: Docker & Docker Compose

## How to Host and Run Locally (Any OS)

Thanks to Docker, running this project on any operating system (Windows, macOS, or Linux) is incredibly easy. You don't need to manually install PHP, Node.js, or MySQL on your host machine.

### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Windows/Mac) or Docker Engine + Docker Compose (for Linux).
2. Ensure Docker is running on your machine.

### Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arlicto/omnesMarketplace.git
   cd omnesMarketplace
   ```

2. **Build and start the application**:
   Simply run the following command in the root directory of the project:
   ```bash
   docker compose up -d --build
   ```
   *(Note: On older Docker versions, you might need to use `docker-compose` with a hyphen instead of a space. On Linux, you might need to prefix the command with `sudo`).*

3. **Access the Application**:
   Once the containers are built and running, you can access the full application (frontend and backend) at:
   **http://localhost:8081**

   - **Frontend**: Accessible at the root `http://localhost:8081/`
   - **Backend API**: Accessible at `http://localhost:8081/api/v1/`

### Stopping the Application

To stop the running containers, execute:
```bash
docker compose down
```

### Database Initialization
The database schema is automatically initialized on the first run using the `database/schema.sql` file. Data will persist in the Docker volume as long as the container isn't destroyed completely.
