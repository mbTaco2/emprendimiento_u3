# Usar una imagen base de PHP 8.0 con FPM para Laravel
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
    && docker-php-ext-install pdo pdo_mysql mbstring zip exif pcntl bcmath \
    && docker-php-ext-install intl  # Instalar la extensión intl

# Paso 2: Instalar Node.js y npm para React
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Paso 3: Instalar Composer (gestor de dependencias de PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Paso 4: Configurar el directorio de trabajo
WORKDIR /var/www

# Paso 5: Copiar primero los archivos de configuración de Composer
COPY composer.json composer.lock ./

# Paso 6: Instalar las dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# Paso 7: Copiar todo el código fuente al contenedor
COPY . .

# Paso 8: Instalar dependencias de npm para React
RUN npm install

# Paso 9: Compilar los archivos de React
RUN npm run prod

# Paso 10: Crear la base de datos SQLite (si usas SQLite)
RUN touch /var/www/database/database.sqlite

# Paso 11: Exponer el puerto 8000
EXPOSE 8000

# Paso 12: Iniciar Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
