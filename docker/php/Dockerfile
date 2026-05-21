FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libicu-dev \
    libonig-dev \
    libcurl4-openssl-dev \
    libssl-dev \
    && docker-php-ext-install zip pdo_mysql intl mbstring curl fileinfo

WORKDIR /var/www/backend

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

EXPOSE 9000
CMD ["php-fpm"]
