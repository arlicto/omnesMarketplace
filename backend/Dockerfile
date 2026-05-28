FROM php:8.3-apache

RUN docker-php-ext-install pdo pdo_mysql

RUN a2enmod rewrite && a2dissite 000-default
COPY apache.conf /etc/apache2/sites-available/omnes.conf
RUN a2ensite omnes

COPY . /var/www/html

RUN chown -R www-data:www-data /var/www/html

EXPOSE 80

CMD ["apache2-foreground"]
