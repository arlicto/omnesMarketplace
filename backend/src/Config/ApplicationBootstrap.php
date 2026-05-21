<?php

declare(strict_types=1);

namespace App\Config;

/**
 * Applies validated configuration to the PHP runtime after Config is initialized.
 */
final class ApplicationBootstrap
{
    public static function apply(): void
    {
        $config = Config::get();
        $app = $config->app();
        $upload = $config->upload();
        $cookie = $config->cookie();

        date_default_timezone_set($app->timezone);

        $maxSize = (string) $upload->maxSizeMegabytes() . 'M';
        ini_set('upload_max_filesize', $maxSize);
        ini_set('post_max_size', $maxSize);
        ini_set('max_file_uploads', (string) $upload->maxFiles);

        if ($app->debug) {
            error_reporting(E_ALL);
        } else {
            error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
            ini_set('display_errors', '0');
            ini_set('display_startup_errors', '0');
        }

        session_name($cookie->sessionName);

        if (session_status() === PHP_SESSION_NONE) {
            session_set_cookie_params($cookie->sessionOptions());
        }
    }
}
