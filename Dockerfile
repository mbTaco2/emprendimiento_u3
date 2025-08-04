# Usar una imagen base de PHP 8.3 con Apache (mejor para Render)
FROM php:8.3-apache

# Configurar el directorio de trabajo
WORKDIR /var/www/html

# Instalar las dependencias necesarias para Laravel y las extensiones de PHP
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
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql mbstring zip exif pcntl bcmath intl \
    && a2enmod rewrite

# Instalar Node.js y npm para React
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copiar archivos de dependencias primero (para cache de Docker)
COPY composer.json composer.lock package.json package-lock.json* ./

# Instalar dependencias de Laravel sin scripts
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Instalar dependencias de npm
RUN npm install --include=dev

# Copiar todo el código fuente
COPY . .

# Crear la base de datos SQLite
RUN touch /var/www/html/database/database.sqlite

# Compilar los assets para producción
RUN npm run build

# Configurar permisos correctos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod 664 /var/www/html/database/database.sqlite

# Configurar Apache DocumentRoot para Laravel
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    <Directory /var/www/html/public>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Crear script de inicialización que usará las variables de entorno de Render
RUN echo '#!/bin/bash\n\
set -e\n\
echo "🐖 Iniciando MiChanchito..."\n\
\n\
# Solo copiar .env.example si no existe .env (Render puede proveer variables de entorno)\n\
if [ ! -f .env ]; then\n\
    cp .env.example .env\n\
fi\n\
\n\
# Si no hay APP_KEY, generarla\n\
if [ -z "$APP_KEY" ]; then\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Ejecutar migraciones\n\
php artisan migrate --force\n\
\n\
# Crear enlace de storage\n\
php artisan storage:link\n\
\n\
# Optimizar Laravel para producción\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
\n\
# Asegurar permisos correctos\n\
chown -R www-data:www-data /var/www/html/storage\n\
chown -R www-data:www-data /var/www/html/bootstrap/cache\n\
chmod -R 775 /var/www/html/storage\n\
chmod -R 775 /var/www/html/bootstrap/cache\n\
\n\
echo "✅ MiChanchito listo!"\n\
exec apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

# Limpiar dependencias de desarrollo
RUN npm prune --production && rm -rf ~/.npm

# Exponer puerto 80 para Render
EXPOSE 80

# Usar el script de inicialización
CMD ["/usr/local/bin/start.sh"]
