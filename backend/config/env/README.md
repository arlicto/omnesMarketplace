# Environment configuration

## Security rules

1. **Never commit** `backend/.env` — only `.env.example` and profile files are safe to commit.
2. **Never put secrets** in `config/env/.env.*` profile files (loader rejects them).
3. **Never log secrets** — `SecretSanitizer` redacts values before writing logs.
4. Use **cryptographically secure** secrets: `php bin/generate-secrets.php`

## Bootstrap

```
EnvLoader → profile → .env → EnvValidator → SecretValidator → Config
```

## Secret length requirements

| Environment | JWT_SECRET | DB_PASSWORD |
|-------------|------------|-------------|
| dev | ≥ 32 chars | ≥ 16 chars |
| staging | ≥ 48 chars | ≥ 24 chars |
| production | ≥ 64 chars | ≥ 32 chars |

Weak placeholders (`changeme`, `password`, `omnes_password`, etc.) are rejected.

## Setup

```bash
cd backend
cp .env.example .env
php bin/generate-secrets.php >> .env
```

## CI check

```bash
php bin/check-env-security.php
```

Fails if any sensitive `.env` file is tracked by git.
