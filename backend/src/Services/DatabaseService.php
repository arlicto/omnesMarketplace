<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Database;
use PDO;

class DatabaseService
{
    private static ?PDO $instance = null;

    /**
     * Get the PDO database connection instance.
     * 
     * @return PDO
     */
    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $database = new Database();
            self::$instance = $database->getConnection();
        }
        return self::$instance;
    }

    /**
     * Private constructor to prevent direct instantiation.
     */
    private function __construct()
    {
    }
}

