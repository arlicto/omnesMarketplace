<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../src/Router.php';
require_once __DIR__ . '/../src/helpers.php';
require_once __DIR__ . '/../src/AuthMiddleware.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

authenticateRequest();

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

$router->get('/api/products', function () {
    $pdo = getDb();
    $type = $_GET['type'] ?? '';
    $category = $_GET['category'] ?? '';
    $limit = min((int) ($_GET['limit'] ?? 50), 100);
    $offset = max((int) ($_GET['offset'] ?? 0), 0);

    $where = [];
    $params = [];

    if ($type) {
        $where[] = 'type = ?';
        $params[] = $type;
    }
    if ($category) {
        $where[] = 'category = ?';
        $params[] = $category;
    }

    $where[] = "status = 'active'";
    $sql = 'SELECT * FROM products';
    if ($where) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }
    $sql .= ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    $params[] = $limit;
    $params[] = $offset;

    $stmt = $pdo->prepare($sql);
    // Bind query strings/where parameters
    foreach ($params as $key => $val) {
        if ($key < count($params) - 2) {
            $stmt->bindValue($key + 1, $val, PDO::PARAM_STR);
        }
    }
    // Bind Limit and Offset explicitly as integers
    $stmt->bindValue(count($params) - 1, $limit, PDO::PARAM_INT);
    $stmt->bindValue(count($params), $offset, PDO::PARAM_INT);
    $stmt->execute();
    return json($stmt->fetchAll(PDO::FETCH_ASSOC));
});

$router->get('/api/products/{id}', function (array $params) {
    $pdo = getDb();
    $stmt = $pdo->prepare('SELECT * FROM products WHERE id = ? AND status = "active"');
    $stmt->execute([$params['id']]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$product) {
        http_response_code(404);
        return json(['error' => 'Product not found']);
    }
    return json($product);
});

$router->get('/api/notifications', function () {
    $pdo = getDb();
    $stmt = $pdo->query('SELECT * FROM notifications ORDER BY created_at DESC');
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $rows = array_map(function ($row) {
        $row['read'] = (bool) $row['is_read'];
        $row['createdAt'] = $row['created_at'];
        unset($row['is_read'], $row['created_at']);
        return $row;
    }, $rows);
    return json($rows);
});

$router->patch('/api/notifications/{id}', function (array $params) {
    $input = json_decode(file_get_contents('php://input'), true);
    $pdo = getDb();
    $fields = [];
    $values = [];
    if (isset($input['read'])) {
        $input['is_read'] = $input['read'];
    }
    foreach (['is_read', 'archived'] as $field) {
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
