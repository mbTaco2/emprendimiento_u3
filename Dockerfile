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
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_sqlite pdo_mysql mbstring zip exif pcntl bcmath intl gd \
    && a2enmod rewrite \
    && a2enmod headers \
    && a2enmod ssl

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

# Limpiar cache de npm y compilar assets
RUN rm -rf node_modules/.cache \
    && npm run build

# Configurar permisos correctos
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache \
    && chmod 664 /var/www/html/database/database.sqlite

# Configurar Apache para HTTPS y mejor manejo de assets
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html/public\n\
    \n\
    # Headers para HTTPS y seguridad\n\
    Header always set X-Forwarded-Proto "https"\n\
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"\n\
    Header always set X-Content-Type-Options nosniff\n\
    Header always set X-Frame-Options DENY\n\
    Header always set X-XSS-Protection "1; mode=block"\n\
    \n\
    # Configurar para que Laravel funcione detrás de proxy HTTPS\n\
    SetEnvIf X-Forwarded-Proto https HTTPS=on\n\
    \n\
    <Directory /var/www/html/public>\n\
        Options -Indexes +FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        \n\
        # Cache para assets estáticos\n\
        <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">\n\
            ExpiresActive On\n\
            ExpiresDefault "access plus 1 month"\n\
            Header append Cache-Control "public, immutable"\n\
        </FilesMatch>\n\
    </Directory>\n\
    \n\
    # Alias para build assets de Vite\n\
    Alias /build /var/www/html/public/build\n\
    <Directory "/var/www/html/public/build">\n\
        Options -Indexes\n\
        AllowOverride None\n\
        Require all granted\n\
    </Directory>\n\
    \n\
    ErrorLog ${APACHE_LOG_DIR}/error.log\n\
    CustomLog ${APACHE_LOG_DIR}/access.log combined\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Habilitar módulos de Apache necesarios
RUN a2enmod expires && a2enmod headers

# Crear script de inicialización mejorado
RUN echo '#!/bin/bash\n\
set -e\n\
echo "🐖 Iniciando MiChanchito..."\n\
\n\
# Solo copiar .env.example si no existe .env\n\
if [ ! -f .env ]; then\n\
    cp .env.example .env\n\
fi\n\
\n\
# Configurar variables para producción si no están definidas\n\
if [ -z "$APP_KEY" ]; then\n\
    echo "Generando APP_KEY..."\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Forzar HTTPS en producción\n\
if [ "$APP_ENV" = "production" ]; then\n\
    echo "APP_URL=${APP_URL:-https://michanchito.onrender.com}" >> .env\n\
    echo "ASSET_URL=${APP_URL:-https://michanchito.onrender.com}" >> .env\n\
    echo "FORCE_HTTPS=true" >> .env\n\
fi\n\
\n\
# Ejecutar migraciones\n\
echo "Ejecutando migraciones..."\n\
php artisan migrate --force\n\
\n\
# Crear enlace de storage\n\
php artisan storage:link --force || true\n\
\n\
# Optimizar Laravel para producción\n\
echo "Optimizando Laravel..."\n\
composer dump-autoload --optimize\n\
php artisan config:cache\n\
php artisan route:cache\n\
php artisan view:cache\n\
\n\
# Asegurar permisos correctos\n\
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache\n\
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache\n\
\n\
echo "✅ MiChanchito listo!"\n\
exec apache2-foreground' > /usr/local/bin/start.sh \
    && chmod +x /usr/local/bin/start.sh

# Limpiar dependencias de desarrollo
RUN npm prune --production && rm -rf ~/.npm /var/cache/apt/*

# Exponer puerto 80 para Render
EXPOSE 80

# Usar el script de inicialización
CMD ["/usr/local/bin/start.sh"]
