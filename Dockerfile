# Imagem base
FROM php:8.3-cli

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    && docker-php-ext-install zip

# Instalar Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY . .

# Instalar dependências PHP
RUN composer install

# Expor porta 3000
EXPOSE 3000

# Comando para iniciar o servidor PHP
CMD ["php", "-S", "0.0.0.0:3000", "-t", "src"]