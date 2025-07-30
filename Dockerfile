# Usar una imagen base de PHP 8.3 con FPM para Laravel
FROM php:8.3-fpm

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
    nginx \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql mbstring zip exif pcntl bcmath \
    && docker-php-ext-install intl

# Paso 2: Instalar Node.js y npm para React
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Paso 3: Instalar Composer (gestor de dependencias de PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Paso 4: Configurar el directorio de trabajo
WORKDIR /var/www

# Paso 5: Copiar archivos de dependencias primero para aprovechar cache de Docker
COPY composer.json composer.lock package.json package-lock.json* ./

# Paso 6: Instalar las dependencias de Laravel como root
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Paso 7: Instalar dependencias de npm
RUN npm install --include=dev

# Paso 8: Copiar todo el código fuente al contenedor
COPY . .

# Paso 9: Crear la base de datos SQLite
RUN touch /var/www/database/database.sqlite

# Paso 10: Compilar los assets para producción con fix para Rollup
RUN rm -rf node_modules/.vite && npm run build

# Paso 11: Configurar permisos correctos
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache \
    && chmod 664 /var/www/database/database.sqlite

# Paso 12: Ejecutar comandos de optimización de Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Paso 13: Limpiar dependencias de desarrollo para reducir tamaño
RUN npm prune --production && rm -rf ~/.npm

# Paso 14: Configurar Nginx
RUN echo 'server {\n\
    listen 80;\n\
    root /var/www/public;\n\
    index index.php;\n\
    \n\
    location / {\n\
        try_files $uri $uri/ /index.php?$query_string;\n\
    }\n\
    \n\
    location ~ \.php$ {\n\
        fastcgi_pass 127.0.0.1:9000;\n\
        fastcgi_index index.php;\n\
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;\n\
        include fastcgi_params;\n\
    }\n\
}' > /etc/nginx/sites-available/default

# Paso 15: Exponer el puerto 80 (Render usa este puerto)
EXPOSE 80

# Paso 16: Script de inicio que ejecuta tanto PHP-FPM como Nginx
CMD ["sh", "-c", "service nginx start && php-fpm"]
