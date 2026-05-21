<?php

declare(strict_types=1);

namespace App\Config;

use App\Config\Settings\DatabaseSettings;
use PDO;
use PDOException;

class Database
{
    private DatabaseSettings $settings;
    public ?PDO $conn = null;

    public function __construct(?DatabaseSettings $settings = null)
    {
        $this->settings = $settings ?? Config::get()->database();
    }

    public function getConnection(): PDO
    {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                $this->settings->dsn(),
                $this->settings->user,
                $this->settings->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
        } catch (PDOException $exception) {
            if (Config::get()->app()->isDevelopment()) {
                throw new PDOException(
                    'Connection error: ' . $exception->getMessage(),
                    (int) $exception->getCode(),
                    $exception
                );
            }

            throw new PDOException('Database connection failed.', (int) $exception->getCode(), $exception);
        }

        return $this->conn;
    }
}
