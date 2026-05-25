<?php

declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit('This script can only be run from the command line.');
}

require __DIR__ . '/vendor/autoload.php';

use App\Security\PasswordHasher;
use App\Support\Uuid;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USERNAME', 'DB_PASSWORD'])->notEmpty();

if (($_ENV['APP_ENV'] ?? 'production') === 'production') {
    echo "ERROR: Seed script cannot run in production.\n";
    exit(1);
}

$host     = $_ENV['DB_HOST']     ?? 'db';
$port     = (int) ($_ENV['DB_PORT'] ?? 3306);
$database = $_ENV['DB_NAME'];
$user     = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];

try {
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $host,
        $port,
        $database
    );

    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "Connected to database successfully.\n";

    $roles = $pdo->query("SELECT slug FROM roles")->fetchAll(PDO::FETCH_COLUMN);
    $requiredRoles = ['buyer', 'seller', 'admin'];
    $missing = array_diff($requiredRoles, $roles);
    if (!empty($missing)) {
        throw new RuntimeException('Missing roles in database: ' . implode(', ', $missing) . '. Run role migrations first.');
    }

    $testUsers = [
        [
            'username' => 'buyer',
            'email' => 'buyer@omnes.edu',
            'password' => 'Omnes@Buyer2026!',
            'role' => 'buyer',
            'first_name' => 'Buyer',
            'last_name' => 'User',
        ],
        [
            'username' => 'seller',
            'email' => 'seller@omnes.edu',
            'password' => 'Omnes@Seller2026!',
            'role' => 'seller',
            'first_name' => 'Seller',
            'last_name' => 'User',
        ],
        [
            'username' => 'admin',
            'email' => 'admin@omnes.edu',
            'password' => 'Omnes@Admin2026!',
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
        ],
    ];

    foreach ($testUsers as $userData) {
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1');
        $stmt->execute(['email' => strtolower($userData['email'])]);
        if ($stmt->fetch()) {
            echo "User {$userData['email']} already exists. Skipping.\n";
            continue;
        }

        $uuid = Uuid::v4();

        $stmt = $pdo->prepare(
            'INSERT INTO users (uuid, username, email, password, first_name, last_name, status, email_verified_at)
             VALUES (:uuid, :username, :email, :password, :first_name, :last_name, :status, NOW())'
        );
        $stmt->execute([
            'uuid' => $uuid,
            'username' => $userData['username'],
            'email' => strtolower($userData['email']),
            'password' => PasswordHasher::hash($userData['password']),
            'first_name' => $userData['first_name'],
            'last_name' => $userData['last_name'],
            'status' => 'active',
        ]);

        $userId = (int) $pdo->lastInsertId();

        $stmt = $pdo->prepare(
            'INSERT INTO user_roles (user_id, role_id)
             SELECT :user_id, r.id FROM roles r WHERE r.slug = :slug'
        );
        $stmt->execute(['user_id' => $userId, 'slug' => $userData['role']]);

        if ($stmt->rowCount() === 0) {
            throw new RuntimeException(
                "Role '{$userData['role']}' not found in roles table. Run the role seed first."
            );
        }

        echo "Created {$userData['role']} user: {$userData['email']}\n";
    }

    echo "\nSeed completed successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

# 1779720138512780119
