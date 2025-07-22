#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Iniciando aplicação...${NC}"
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Aplicação iniciada com sucesso!${NC}"
    echo -e "A API está disponível em http://localhost:3000"
else
    echo -e "${RED}Erro ao iniciar a aplicação${NC}"
    exit 1
fi