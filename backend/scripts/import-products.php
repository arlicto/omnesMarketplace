<?php

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../src/helpers.php';

function generateUuid(): string
{
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$csvFile = $argv[1] ?? __DIR__ . '/../seed.csv';

if (!file_exists($csvFile)) {
    fwrite(STDERR, "File not found: $csvFile\n");
    exit(1);
}

$handle = fopen($csvFile, 'r');
if (!$handle) {
    fwrite(STDERR, "Failed to open: $csvFile\n");
    exit(1);
}

$header = fgetcsv($handle);
if (!$header) {
    fwrite(STDERR, "Empty CSV file\n");
    exit(1);
}

$header = array_map('trim', $header);
$expected = ['name', 'description', 'price', 'category', 'type', 'image', 'seller_id', 'status'];

$missing = array_diff($expected, $header);
if ($missing) {
    fwrite(STDERR, "Missing columns: " . implode(', ', $missing) . "\n");
    exit(1);
}

$pdo = getDb();
$stmt = $pdo->prepare(
    'INSERT INTO products (id, name, description, price, category, type, image, seller_id, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
);

$imported = 0;
$errors = 0;

while (($row = fgetcsv($handle)) !== false) {
    $row = array_map('trim', $row);

    if (count($row) < count($header)) {
        $errors++;
        continue;
    }

    $data = array_combine($header, $row);

    if (empty($data['name']) || empty($data['price'])) {
        $errors++;
        continue;
    }

    $stmt->execute([
        generateUuid(),
        $data['name'],
        $data['description'] ?? '',
        (float) $data['price'],
        $data['category'] ?? '',
        $data['type'],
        $data['image'] ?? '',
        $data['seller_id'] ?? '',
        $data['status'] ?? 'active',
    ]);

    $imported++;
}

fclose($handle);
echo json(['imported' => $imported, 'errors' => $errors]) . "\n";

# 1780769887174140991

# 1781288288681946920
