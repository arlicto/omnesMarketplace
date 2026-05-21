#!/usr/bin/env php
<?php

declare(strict_types=1);

/**
 * CI/local guard: fails if any .env file (except .env.example and profiles) is tracked by git.
 *
 * Usage: php bin/check-env-security.php
 */

$root = dirname(__DIR__);
$repoRoot = dirname($root);

$tracked = [];
$command = 'git -C ' . escapeshellarg($repoRoot) . ' ls-files';
exec($command, $tracked);

$violations = [];

foreach ($tracked as $file) {
    if (!str_starts_with($file, 'backend/')) {
        continue;
    }

    $basename = basename($file);

    if ($basename === '.env.example') {
        continue;
    }

    if (str_starts_with($basename, '.env.') && str_contains($file, 'config/env/')) {
        continue;
    }

    if ($basename === '.env' || $basename === '.env.local' || preg_match('/\.env\./', $basename) === 1) {
        $violations[] = $file;
    }
}

if ($violations !== []) {
    fwrite(STDERR, "SECURITY: The following env files must not be committed:\n");
    foreach ($violations as $file) {
        fwrite(STDERR, "  - {$file}\n");
    }
    exit(1);
}

echo "OK: No sensitive .env files are tracked by git.\n";
