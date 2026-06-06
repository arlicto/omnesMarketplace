#!/bin/bash
set -e

# Wait for MySQL to be ready
if [ -n "$DB_HOST" ]; then
  echo "Waiting for MySQL at $DB_HOST..."
  until php -r "
    try {
      new PDO('mysql:host=$DB_HOST;port=${DB_PORT:-3306};dbname=$DB_NAME', '$DB_USER', '$DB_PASS');
      echo 'connected';
    } catch (PDOException \$e) {
      echo \$e->getMessage();
      exit(1);
    }
  " 2>/dev/null | grep -q 'connected'; do
    sleep 2
  done
  echo "MySQL is ready."

  # Seed products if table is empty
  COUNT=$(php -r "
    require '/var/www/html/config/database.php';
    echo getDb()->query('SELECT COUNT(*) FROM products')->fetchColumn();
  " 2>/dev/null || echo "0")

  if [ "$COUNT" = "0" ]; then
    echo "Seeding products from CSV..."
    php /var/www/html/scripts/import-products.php /var/www/html/seed.csv
  else
    echo "Products already seeded ($COUNT found)."
  fi
fi

exec apache2-foreground

# 1780769888840808532
