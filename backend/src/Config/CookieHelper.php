<?php

declare(strict_types=1);

namespace App\Config;

/**
 * Builds secure Set-Cookie option arrays from centralized cookie configuration.
 */
final class CookieHelper
{
    /** @return array<string, bool|int|string|null> */
    public static function options(int $expires = 0): array
    {
        $defaults = Config::get()->cookie()->defaults();
        $defaults['expires'] = $expires;

        return $defaults;
    }

    public static function set(string $name, string $value, int $expires = 0): bool
    {
        return setcookie($name, $value, self::options($expires));
    }

    public static function delete(string $name): bool
    {
        return setcookie($name, '', self::options(time() - 3600));
    }
}
