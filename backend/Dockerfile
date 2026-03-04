# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.js ./
COPY resources/ resources/
RUN npm run build

# Stage 2: PHP application
FROM php:8.4-cli

RUN apt-get update && apt-get install -y \
    libsqlite3-dev \
    libzip-dev \
    unzip \
    && docker-php-ext-install pdo_sqlite zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY . .

# Copy built assets from frontend stage
COPY --from=frontend /app/public/build public/build

# Setup environment — .env must exist before composer scripts (package:discover) run
RUN cp .env.example .env \
    && sed -i 's|APP_URL=http://localhost|APP_URL=http://localhost:8000|' .env \
    && composer install --no-dev --optimize-autoloader \
    && php artisan key:generate

# Create SQLite database directory and set permissions
RUN mkdir -p database \
    && touch database/database.sqlite \
    && php artisan migrate --force \
    && php artisan db:seed --force

# Ensure storage directories exist with proper permissions
RUN chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
