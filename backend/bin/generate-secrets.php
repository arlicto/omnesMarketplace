#!/usr/bin/env php
<?php

declare(strict_types=1);

/**
 * Generates cryptographically secure secrets for backend/.env
 *
 * Usage:
 *   php bin/generate-secrets.php          # print to stdout
 *   php bin/generate-secrets.php >> .env  # append to .env
 */

function generateSecret(int $bytes = 32): string
{
    return bin2hex(random_bytes($bytes));
}

$dbPassword = generateSecret(24);
$jwtSecret = generateSecret(32);

echo "# --- Generated " . date('c') . " — store in .env only, never commit ---\n";
echo "DB_PASSWORD={$dbPassword}\n";
echo "MYSQL_PASSWORD={$dbPassword}\n";
echo "JWT_SECRET={$jwtSecret}\n";
