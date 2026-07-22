#!/bin/bash
set -e

echo "Waiting for MySQL..."
until mysqladmin ping -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" --silent 2>/dev/null; do
  sleep 2
done

echo "Importing products from CSV..."
php /var/www/html/scripts/import-products.php /var/www/html/seed.csv

echo "Seed complete."

# 1781115484185164112

# 1784744285334984028
