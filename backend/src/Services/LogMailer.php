<?php

declare(strict_types=1);

namespace App\Services;

final class LogMailer implements MailerInterface
{
    public function __construct(private string $logPath)
    {
        $dir = dirname($this->logPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0750, true);
        }
    }

    public function send(string $to, string $subject, string $body): void
    {
        $entry = sprintf(
            "[%s] TO:%s SUBJECT:%s\n%s\n---\n",
            date('Y-m-d H:i:s'),
            $to,
            $subject,
            $body
        );
        file_put_contents($this->logPath, $entry, FILE_APPEND | LOCK_EX);
    }
}
