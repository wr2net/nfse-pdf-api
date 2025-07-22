#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

docker stop php_version-api-php-1
echo -e "${GREEN}Aplicação encerrada com sucesso!${NC}"