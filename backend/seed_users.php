<?php

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use App\Security\PasswordHasher;

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->safeLoad();

// Simple database connection using environment variables
// Use 'db' when running inside Docker, 'localhost:3307' when running from host
$host = 'db';
$port = 3306;
$database = 'omnes_db';
$user = 'root';
$password = 'root_password';

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

    // Create test users
    $testUsers = [
        [
            'username' => 'buyer',
            'email' => 'buyer@omnes.edu',
            'password' => 'buyer123',
            'role' => 'buyer',
            'first_name' => 'Buyer',
            'last_name' => 'User',
        ],
        [
            'username' => 'seller',
            'email' => 'seller@omnes.edu',
            'password' => 'seller123',
            'role' => 'seller',
            'first_name' => 'Seller',
            'last_name' => 'User',
        ],
        [
            'username' => 'admin',
            'email' => 'admin@omnes.edu',
            'password' => 'admin123',
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
        ],
    ];

    foreach ($testUsers as $userData) {
        // Check if user already exists
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = :email AND deleted_at IS NULL LIMIT 1');
        $stmt->execute(['email' => strtolower($userData['email'])]);
        if ($stmt->fetch()) {
            echo "User {$userData['email']} already exists. Skipping.\n";
            continue;
        }

        // Generate UUID
        $uuid = sprintf(
            '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0xffff)
        );

        // Insert user
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

        // Assign role
        $stmt = $pdo->prepare(
            'INSERT INTO user_roles (user_id, role_id)
             SELECT :user_id, r.id FROM roles r WHERE r.slug = :slug'
        );
        $stmt->execute(['user_id' => $userId, 'slug' => $userData['role']]);

        echo "Created {$userData['role']} user: {$userData['email']} (password: {$userData['password']})\n";
    }

    echo "\nSeed completed successfully!\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
