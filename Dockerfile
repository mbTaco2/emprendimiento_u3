# Usar una imagen base de PHP 8.3 con Apache (más simple que FPM+Nginx)
FROM php:8.3-apache

# Paso 1: Instalar las dependencias necesarias para Laravel y las extensiones de PHP
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libzip-dev \
    zip \
    git \
    curl \
    libonig-dev \
    libxml2-dev \
    libicu-dev \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql mbstring zip exif pcntl bcmath \
    && docker-php-ext-install intl \
    && a2enmod rewrite

# Paso 2: Instalar Node.js y npm para React
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Paso 3: Instalar Composer (gestor de dependencias de PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Paso 4: Configurar el directorio de trabajo
WORKDIR /var/www/html

# Paso 5: Copiar archivos de dependencias primero para aprovechar cache de Docker
COPY composer.json composer.lock package.json package-lock.json* ./

# Paso 6: Instalar las dependencias de Laravel como root
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Paso 7: Instalar dependencias de npm
RUN npm install --include=dev

# Paso 8: Copiar todo el código fuente al contenedor
COPY . .

# Paso 9: Crear la base de datos SQLite
RUN touch /var/www/html/database/database.sqlite

# Paso 10: Compilar los assets para producción con fix para Rollup
RUN rm -rf node_modules/.vite && npm run build

# Paso 11: Configurar permisos correctos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod 664 /var/www/html/database/database.sqlite

# Paso 12: Ejecutar comandos de Laravel (sin cache por ahora)
RUN php artisan key:generate --force \
    && php artisan migrate --force \
    && php artisan storage:link

# Paso 13: Limpiar dependencias de desarrollo para reducir tamaño
RUN npm prune --production && rm -rf ~/.npm

# Paso 14: Configurar Apache DocumentRoot
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Paso 15: Exponer el puerto 80
EXPOSE 80

# Paso 16: Comando de inicio - Apache en foreground
CMD ["apache2-foreground"]
