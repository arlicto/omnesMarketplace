# Production Nginx Configuration & Deployment Guide

This document details the production Nginx configuration for the Omnes Marketplace application.

## Configuration Overview

**Location**: `docker/nginx/production.conf`

### Features Implemented

✅ **Reverse Proxy** - Routes requests to PHP-FPM backend and frontend
✅ **HTTPS Redirects** - Automatic HTTP to HTTPS redirection
✅ **Security Headers** - Comprehensive security headers for hardening
✅ **Compression** - Gzip compression for text-based assets
✅ **Static Caching** - Aggressive caching for static assets
✅ **Upload Limits** - 10MB upload limit for images
✅ **API Proxying** - Proper FastCGI proxying to PHP-FPM
✅ **PHP-FPM Integration** - Optimized FastCGI configuration
✅ **Rate Limiting** - Multi-zone rate limiting for different endpoints
✅ **CSP Headers** - Content Security Policy for XSS protection

## Configuration Details

### Rate Limiting Zones

Three rate limiting zones are configured for different use cases:

1. **API Limit** (`api_limit`)
   - Rate: 10 requests per second
   - Burst: 20 requests
   - Applied to: All `/api` endpoints

2. **Auth Limit** (`auth_limit`)
   - Rate: 5 requests per minute
   - Burst: 3 requests
   - Applied to: `/api/v1/auth/login` endpoint

3. **Upload Limit** (`upload_limit`)
   - Rate: 2 requests per minute
   - Burst: 2 requests
   - Applied to: `/api/v1/images` endpoint

4. **Connection Limit** (`conn_limit`)
   - Maximum: 10 concurrent connections per IP
   - Applied to: All endpoints

### SSL/TLS Configuration

- **Protocols**: TLSv1.2, TLSv1.3
- **Ciphers**: Modern, secure cipher suites
- **Session Cache**: 10MB shared cache
- **Session Timeout**: 10 minutes
- **OCSP Stapling**: Enabled for certificate validation

### Security Headers

All security headers are applied with `always` directive to ensure they're sent on all responses:

1. **Strict-Transport-Security (HSTS)**
   - Max age: 1 year
   - Include subdomains
   - Preload enabled

2. **X-Frame-Options**
   - Value: `SAMEORIGIN`
   - Prevents clickjacking

3. **X-Content-Type-Options**
   - Value: `nosniff`
   - Prevents MIME sniffing

4. **X-XSS-Protection**
   - Value: `1; mode=block`
   - XSS filter enabled

5. **Referrer-Policy**
   - Value: `strict-origin-when-cross-origin`
   - Controls referrer information

6. **Permissions-Policy**
   - Blocks: camera, microphone, geolocation, payment
   - Prevents unauthorized feature access

7. **X-Permitted-Cross-Domain-Policies**
   - Value: `none`
   - Prevents cross-domain policy loading

8. **Cross-Origin-Opener-Policy**
   - Value: `same-origin`
   - Isolates browsing contexts

9. **Cross-Origin-Resource-Policy**
   - Value: `same-origin`
   - Prevents cross-origin resource loading

### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https:;
frame-ancestors 'none';
form-action 'self';
base-uri 'self';
```

**Note**: The CSP allows `unsafe-inline` and `unsafe-eval` for scripts and styles to support Vite's development mode. In production, consider tightening this policy by using nonce or hash-based CSP.

### Compression

**Gzip Compression** (Enabled)
- Level: 6
- Types: text, css, xml, javascript, json, rss, fonts, svg
- Proxied requests: Compressed
- Vary header: Enabled

**Brotli Compression** (Commented - Optional)
- Level: 6
- Same types as gzip
- Uncomment if Brotli module is available

### Static Caching

**Static Assets** (JS, CSS, Images, Fonts)
- Cache duration: 1 year
- Cache control: `public, immutable`
- Access logging: Disabled

**HTML Files**
- Cache duration: 1 hour
- Cache control: `public, must-revalidate`

### Upload Limits

- **Client Max Body Size**: 10MB
- **Client Body Buffer Size**: 128KB
- **PHP Upload Max Filesize**: 10MB
- **PHP Post Max Size**: 10MB
- **PHP Max Execution Time**: 30s (60s for uploads)
- **PHP Max Input Time**: 30s (60s for uploads)

### PHP-FPM Configuration

**Upstream Configuration**
- Server: `php:9000`
- Keepalive connections: 32

**FastCGI Parameters**
- Buffer size: 128KB
- Buffers: 256 × 16KB
- Busy buffers: 256KB
- Temp file write size: 256KB

**FastCGI Timeouts**
- Connect: 60s
- Send: 60s
- Read: 60s

### Timeouts

- **Client Body Timeout**: 30s
- **Client Header Timeout**: 30s
- **Keepalive Timeout**: 65s
- **Send Timeout**: 30s

### HTTP to HTTPS Redirect

All HTTP traffic is automatically redirected to HTTPS with a 301 permanent redirect. The ACME challenge endpoint for Let's Encrypt is allowed on HTTP.

### File Access Restrictions

The following file types are blocked from public access:

- Hidden files (`.git`, `.env`, etc.)
- Sensitive files (`.env`, `.git`, `.svn`, `.htaccess`, `.htpasswd`)
- Backup files (`.bak`, `.backup`, `.old`, `.orig`, `.save`)
- Log files (`.log`)

## Deployment Steps

### 1. SSL Certificate Setup

**Option A: Self-Signed Certificate (Development)**
```bash
mkdir -p docker/nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/nginx/ssl/key.pem \
  -out docker/nginx/ssl/cert.pem
```

**Option B: Let's Encrypt (Production)**
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to Docker volume
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem docker/nginx/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem docker/nginx/ssl/key.pem
```

### 2. Update docker-compose.prod.yml

Add SSL volume to Nginx service:
```yaml
nginx:
  volumes:
    - ./docker/nginx/ssl:/etc/nginx/ssl:ro
```

### 3. Build and Start Production Containers

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

### 4. Verify Configuration

```bash
# Check Nginx configuration syntax
docker compose exec nginx nginx -t

# Check SSL certificate
docker compose exec nginx openssl s_client -connect localhost:443

# Test rate limiting
ab -n 100 -c 10 https://localhost/api/v1/health
```

### 5. Monitor Logs

```bash
# Nginx access logs
docker compose logs -f nginx

# Nginx error logs
docker compose exec nginx tail -f /var/log/nginx/error.log

# Rate limiting logs
docker compose exec nginx tail -f /var/log/nginx/error.log | grep "limiting"
```

## Performance Optimization

### 1. Enable HTTP/2

HTTP/2 is enabled by default in the configuration for better performance.

### 2. Enable Brotli Compression (Optional)

If your Nginx build includes Brotli support, uncomment the Brotli directives in the configuration.

### 3. Adjust Worker Processes

Add to Nginx configuration:
```nginx
worker_processes auto;
worker_rlimit_nofile 65535;
```

### 4. Enable Connection Caching

Already configured with `keepalive 32` in the upstream block.

### 5. Use CDN for Static Assets

Consider using a CDN (Cloudflare, AWS CloudFront) for static assets to reduce load on your server.

## Security Hardening

### 1. Fail2Ban Integration

Install Fail2Ban to block IPs that exceed rate limits:
```bash
sudo apt-get install fail2ban

# Create Nginx rate limit filter
sudo nano /etc/fail2ban/jail.d/nginx-rate-limit.conf
```

### 2. ModSecurity (Optional)

Install ModSecurity WAF for additional security:
```bash
sudo apt-get install libnginx-mod-security
```

### 3. IP Whitelisting

Add IP whitelisting for admin endpoints:
```nginx
location /api/v1/admin {
    allow 192.168.1.0/24;
    deny all;
    # ... rest of configuration
}
```

### 4. Disable Server Tokens

Add to http block:
```nginx
server_tokens off;
```

## Monitoring

### 1. Health Checks

The `/health` endpoint is available for health checks:
```bash
curl https://yourdomain.com/health
```

### 2. Metrics Collection

Use Nginx stub_status for metrics:
```nginx
location /nginx_status {
    stub_status on;
    access_log off;
    allow 127.0.0.1;
    deny all;
}
```

### 3. Log Analysis

Use tools like GoAccess or ELK Stack for log analysis:
```bash
docker compose exec nginx goaccess /var/log/nginx/access.log -c
```

## Troubleshooting

### SSL Certificate Issues

**Problem**: Certificate not found
```bash
# Check if certificate files exist
docker compose exec nginx ls -la /etc/nginx/ssl/

# Check file permissions
docker compose exec nginx ls -la /etc/nginx/ssl/
```

### Rate Limiting Too Aggressive

**Problem**: Legitimate requests being blocked
```bash
# Adjust rate limits in production.conf
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=20r/s;
```

### PHP-FPM Connection Issues

**Problem**: 502 Bad Gateway
```bash
# Check PHP-FPM status
docker compose ps php

# Check PHP-FPM logs
docker compose logs php

# Verify upstream configuration
docker compose exec nginx nginx -t
```

### Static Files Not Caching

**Problem**: Cache headers not being sent
```bash
# Check response headers
curl -I https://yourdomain.com/assets/main.js

# Verify cache configuration
docker compose exec nginx nginx -T | grep -A 5 "location ~"
```

## Maintenance

### SSL Certificate Renewal

For Let's Encrypt certificates, set up automatic renewal:
```bash
sudo certbot renew --quiet
docker compose restart nginx
```

### Log Rotation

Set up logrotate for Nginx logs:
```bash
sudo nano /etc/logrotate.d/nginx-docker
```

### Configuration Updates

After updating the Nginx configuration:
```bash
# Test configuration
docker compose exec nginx nginx -t

# Reload Nginx
docker compose exec nginx nginx -s reload
```

## Testing

### Load Testing

Use Apache Bench to test rate limiting:
```bash
# Test API rate limit
ab -n 100 -c 10 https://localhost/api/v1/health

# Test auth rate limit
ab -n 20 -c 5 -p login.json -T application/json https://localhost/api/v1/auth/login
```

### Security Testing

Use tools to test security headers:
```bash
# Test security headers
curl -I https://localhost

# Test SSL configuration
nmap --script ssl-enum-ciphers -p 443 localhost

# Test CSP
curl -I https://localhost | grep Content-Security-Policy
```

## Production Checklist

Before deploying to production:

- [ ] SSL certificates installed and valid
- [ ] Security headers configured
- [ ] Rate limiting tested and tuned
- [ ] CSP headers reviewed and tightened
- [ ] Upload limits appropriate for use case
- [ ] Compression enabled and tested
- [ ] Static caching configured
- [ ] PHP-FPM optimized
- [ ] Health check endpoint accessible
- [ ] Monitoring and logging configured
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Load testing completed

# update 1779719801
