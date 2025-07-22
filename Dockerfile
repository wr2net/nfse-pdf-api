# Imagem base
FROM php:8.3-cli

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    libxml2-dev \
    zlib1g-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip pdo pdo_mysql xml gd

# Aumentar limites do PHP
RUN echo "memory_limit=256M" > /usr/local/etc/php/conf.d/memory-limit.ini

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Criar diretório de trabalho
WORKDIR /app

# Copiar composer.json primeiro
COPY composer.json ./

# Instalar dependências PHP com --prefer-dist para melhor performance
RUN composer install --no-scripts --no-autoloader --prefer-dist

# Copiar o resto dos arquivos do projeto
COPY . .

# Gerar autoloader otimizado
RUN composer dump-autoload --optimize

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar o servidor PHP
CMD ["php", "-S", "0.0.0.0:3000", "-t", "src"]