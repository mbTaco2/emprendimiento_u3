# Paso 1: Usar una imagen base de PHP 8.0 con FPM para Laravel
FROM php:8.0-fpm

# Paso 2: Instalar las dependencias necesarias para Laravel
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
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql zip exif pcntl

# Paso 3: Instalar Node.js y npm para React
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs

# Paso 4: Instalar Composer para gestionar dependencias de Laravel
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Paso 5: Configurar el directorio de trabajo en el contenedor
WORKDIR /var/www

# Paso 6: Copiar el archivo de configuración de Composer
COPY composer.json composer.lock ./

# Paso 7: Instalar las dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# Paso 8: Copiar todo el código fuente al contenedor
COPY . .

# Paso 9: Instalar las dependencias de npm para React
RUN npm install

# Paso 10: Compilar los archivos de React
RUN npm run prod

# Paso 11: Crear la base de datos SQLite (si usas SQLite)
RUN touch /var/www/database/database.sqlite

# Paso 12: Exponer el puerto 8000 para que Laravel sirva la aplicación
EXPOSE 8000

# Paso 13: Iniciar Laravel usando el comando php artisan serve
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
