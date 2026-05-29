<?php

declare(strict_types=1);

function json(mixed $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE);
}

# 1780078688660757218
