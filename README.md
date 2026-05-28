# Omnes Marketplace

Welcome to the Omnes Marketplace project! This is a modern, full-stack application with a React/Vite frontend and a PHP backend, all orchestrated seamlessly with Docker.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: PHP (Slim Framework)
- **Database**: MySQL 8.0
- **Web Server**: Nginx
- **Infrastructure**: Docker & Docker Compose

## How to Run Locally

### Option A: Docker (Recommended)

Thanks to Docker, running this project on any operating system (Windows, macOS, or Linux) is incredibly easy. You don't need to manually install PHP, Node.js, or MySQL on your host machine.

#### Prerequisites
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for Windows/Mac) or Docker Engine + Docker Compose (for Linux).
2. Ensure Docker is running on your machine.

#### Getting Started

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

#### Stopping the Application

To stop the running containers, execute:
```bash
docker compose down
```

#### Database Initialization
The database schema is automatically initialized on the first run using the `database/schema.sql` file. Data will persist in the Docker volume as long as the container isn't destroyed completely.

---

### Option B: Local Development (Without Docker)

Run the frontend and backend directly on your machine for faster development iteration.

#### Prerequisites

- **PHP 8.1+** with extensions: `pdo_mysql`, `mbstring`, `gd`
- **Composer** (PHP dependency manager)
- **Node.js 18+** and **npm**
- **MySQL 8.0** running locally

#### 1. Database Setup

Create the database and import the schema:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS omnes_db;"
mysql -u root -p omnes_db < database/schema.sql
```

#### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy and configure environment
cp .env.example .env
```

Edit `backend/.env` and `backend/config/env/.env.development` — at minimum, update `DB_HOST` from `db` to `127.0.0.1` and set your MySQL credentials. Run the secret generator or paste your own values:

```bash
php bin/generate-secrets.php >> .env
```

Start the PHP built-in development server:

```bash
php -S localhost:8080 -t public/
```

The backend API will be available at `http://localhost:8080/api/v1/`.

#### 3. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Copy environment file
cp .env.local.example .env.local 2>/dev/null || true
```

Edit `frontend/.env.local` and ensure the API URL points to the backend:

```
VITE_API_URL=http://localhost:8080/api/v1
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

#### 4. Access the Application

Open **http://localhost:5173** in your browser. The frontend proxies API requests to the PHP backend at `http://localhost:8080`.
