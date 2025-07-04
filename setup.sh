#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Iniciando setup do ambiente...${NC}"

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker não está instalado. Por favor, instale o Docker primeiro.${NC}"
    exit 1
fi

# Criar diretório para logs se não existir
mkdir -p logs

# Construir a imagem Docker
echo -e "${GREEN}Construindo imagem Docker...${NC}"
docker build -t nfse-pdf-api .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Setup concluído com sucesso!${NC}"
    echo -e "Use ./run.sh para iniciar a aplicação"
else
    echo -e "${RED}Erro durante o setup${NC}"
    exit 1
fi