# Docker Setup Guide

This guide explains how to run the Omnes Marketplace application using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

### Development

1. Copy the environment template:
```bash
cp docker.env.example docker.env
```

2. Update the environment variables in `docker.env` as needed.

3. Start all services:
```bash
docker compose up
```

The application will be available at:
- Frontend: http://localhost:8081
- API: http://localhost:8081/api/v1
- Database: localhost:3307

### Production

1. Copy the environment template:
```bash
cp docker.env.example docker.env
```

2. Update the environment variables for production in `docker.env`.

3. Build and start production containers:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

The application will be available at:
- Frontend: http://localhost (port 80)
- API: http://localhost/api/v1
- Database: localhost:3306

## Services

### PHP-FPM Backend
- **Container**: `omnes_php`
- **Port**: 9000 (internal)
- **Volumes**: Backend code, storage, uploads

### Nginx Reverse Proxy
- **Container**: `omnes_nginx`
- **Port**: 8081 (development), 80 (production)
- **Volumes**: Backend code, uploads, Nginx config

### MySQL Database
- **Container**: `omnes_db`
- **Port**: 3307 (development), 3306 (production)
- **Volumes**: MySQL data, schema files
- **Health Check**: MySQL ping

### Frontend (Vite)
- **Container**: `omnes_frontend`
- **Port**: 5173 (development), 4173 (production)
- **Volumes**: Frontend code, node_modules

## Volumes

### Development Volumes
- `mysql_data`: MySQL database persistence
- `backend_storage`: Backend storage files
- `backend_uploads`: User uploaded files

### Production Volumes
- `mysql_data`: MySQL database persistence
- `backend_storage`: Backend storage files
- `backend_uploads`: User uploaded files
- `frontend_dist`: Built frontend assets
- `nginx_logs`: Nginx access and error logs

## Environment Variables

### Application
- `APP_ENV`: Application environment (development/production)
- `NGINX_PORT`: Nginx port (default: 8081)
- `APP_URL`: Application URL
- `APP_NAME`: Application name

### Database
- `DB_HOST`: Database host (default: db)
- `DB_PORT`: Database port (default: 3306)
- `DB_DATABASE`: Database name (default: omnes_db)
- `DB_USERNAME`: Database username (default: omnes_user)
- `DB_PASSWORD`: Database password
- `DB_ROOT_PASSWORD`: MySQL root password

### Frontend
- `VITE_API_URL`: API endpoint URL for frontend

### JWT
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRATION`: Access token expiration (seconds)
- `JWT_REFRESH_EXPIRATION`: Refresh token expiration (seconds)

### Security
- `CSRF_ENABLED`: Enable CSRF protection (true/false)
- `HTTPS_ENABLED`: Enable HTTPS redirect (true/false)
- `RATE_LIMIT_ENABLED`: Enable rate limiting (true/false)

### Upload
- `UPLOAD_MAX_SIZE`: Maximum upload size in bytes
- `UPLOAD_ALLOWED_MIMES`: Allowed MIME types (comma-separated)

## Hot Reload

### Backend
The backend code is mounted as a volume, so changes are reflected immediately. However, you may need to restart the PHP-FPM container for some changes:

```bash
docker compose restart php
```

### Frontend
The frontend uses Vite's hot module replacement (HMR). Changes to React components are reflected immediately in the browser without a full reload.

## Database Initialization

The database schema is automatically initialized on first run from the `database/schema` directory. To manually initialize the database:

```bash
docker compose exec db mysql -u root -p omnes_db < database/schema.sql
```

## Common Commands

### Start services
```bash
docker compose up
```

### Start services in detached mode
```bash
docker compose up -d
```

### Stop services
```bash
docker compose down
```

### Stop services and remove volumes
```bash
docker compose down -v
```

### View logs
```bash
docker compose logs -f
```

### View logs for a specific service
```bash
docker compose logs -f php
```

### Rebuild a service
```bash
docker compose up --build php
```

### Execute command in a container
```bash
docker compose exec php bash
docker compose exec db mysql -u root -p
```

### Run database migrations
```bash
docker compose exec php php /var/www/backend/bin/migrate.php
```

### Seed database
```bash
docker compose exec php php /var/www/backend/bin/seed.php
```

## Troubleshooting

### Port conflicts
If ports are already in use, modify the port mappings in `docker-compose.yml`:
```yaml
ports:
  - "8082:80"  # Change 8081 to 8082
```

### Database connection issues
1. Ensure the database container is healthy:
```bash
docker compose ps
```

2. Check database logs:
```bash
docker compose logs db
```

3. Verify environment variables in `docker.env`

### Permission issues with uploads
Ensure the backend storage and uploads volumes have correct permissions:
```bash
docker compose exec php chown -R www-data:www-data /var/www/backend/storage
docker compose exec php chown -R www-data:www-data /var/www/backend/public/uploads
```

### Frontend not loading
1. Check if Vite is running:
```bash
docker compose logs frontend
```

2. Verify VITE_API_URL is correctly set in `docker.env`

3. Check Nginx configuration:
```bash
docker compose logs nginx
```

## Production Deployment

For production deployment:

1. Use `docker-compose.prod.yml` instead of `docker-compose.yml`
2. Set `APP_ENV=production` in environment variables
3. Use strong, unique passwords for all secrets
4. Enable HTTPS
5. Configure proper backup strategy for MySQL data
6. Use a reverse proxy with SSL termination
7. Set up monitoring and logging
8. Configure proper resource limits in docker-compose

## Security Considerations

- Never commit `.env` or `docker.env` files to version control
- Use strong, unique passwords for production
- Keep Docker images updated
- Use Docker secrets for sensitive data in production
- Limit container privileges
- Use non-root users in containers where possible
- Enable HTTPS in production
- Regularly update dependencies

## Performance Optimization

### Development
- Use volume mounts for hot reload
- Disable production optimizations
- Use smaller base images for faster builds

### Production
- Use multi-stage builds to reduce image size
- Enable caching in Docker builds
- Use optimized base images
- Enable gzip compression in Nginx
- Configure proper resource limits
- Use CDN for static assets
