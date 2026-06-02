<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../src/Router.php';
require_once __DIR__ . '/../src/helpers.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$router = new Router();

$router->get('/api/health', fn () => json(['status' => 'ok']));

$router->get('/api/users/{id}/role', function (array $params) {
    $userId = $params['id'];
    $pdo = getDb();
    $stmt = $pdo->prepare('SELECT role FROM users WHERE clerk_id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    return json($user ?: ['role' => 'buyer']);
});

$router->get('/api/cart', function () {
    $pdo = getDb();
    $stmt = $pdo->query('SELECT * FROM cart_items ORDER BY created_at DESC');
    return json(['items' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
});

$router->post('/api/cart', function () {
    $input = json_decode(file_get_contents('php://input'), true);
    $pdo = getDb();
    $stmt = $pdo->prepare('INSERT INTO cart_items (id, name, price, quantity, image, type) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$input['id'], $input['name'], $input['price'], $input['quantity'] ?? 1, $input['image'], $input['type']]);
    $stmt = $pdo->query('SELECT * FROM cart_items ORDER BY created_at DESC');
    return json(['items' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
});

$router->delete('/api/cart/{id}', function (array $params) {
    $pdo = getDb();
    $stmt = $pdo->prepare('DELETE FROM cart_items WHERE id = ?');
    $stmt->execute([$params['id']]);
    $stmt = $pdo->query('SELECT * FROM cart_items ORDER BY created_at DESC');
    return json(['items' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
});

$router->patch('/api/cart/{id}', function (array $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $pdo = getDb();
    $stmt = $pdo->prepare('UPDATE cart_items SET quantity = ? WHERE id = ?');
    $stmt->execute([$input['quantity'], $params['id']]);
    $stmt = $pdo->query('SELECT * FROM cart_items ORDER BY created_at DESC');
    return json(['items' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);
});

$router->get('/api/notifications', function () {
    $pdo = getDb();
    $stmt = $pdo->query('SELECT * FROM notifications ORDER BY created_at DESC');
    return json($stmt->fetchAll(PDO::FETCH_ASSOC));
});

$router->patch('/api/notifications/{id}', function (array $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $pdo = getDb();
    $fields = [];
    $values = [];
    foreach (['read', 'archived'] as $field) {
        if (isset($input[$field])) {
            $fields[] = "$field = ?";
            $values[] = $input[$field] ? 1 : 0;
        }
    }
    if ($fields) {
        $values[] = $params['id'];
        $stmt = $pdo->prepare('UPDATE notifications SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($values);
    }
    return json(['ok' => true]);
});

$router->dispatch();

# 1780424301591758001
