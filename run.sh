#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Nome do container
CONTAINER_NAME="nfse-pdf-api"

# Verificar se já existe um container com o mesmo nome
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    echo -e "${GREEN}Parando container existente...${NC}"
    docker stop ${CONTAINER_NAME}
    docker rm ${CONTAINER_NAME}
fi

# Executar o container
echo -e "${GREEN}Iniciando aplicação...${NC}"
docker run -d \
    --name ${CONTAINER_NAME} \
    -p 3000:3000 \
    --restart unless-stopped \
    nfse-pdf-api

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Aplicação iniciada com sucesso!${NC}"
    echo -e "A API está disponível em http://localhost:3000"
else
    echo -e "${RED}Erro ao iniciar a aplicação${NC}"
    exit 1
fi

# Mostrar logs
echo -e "${GREEN}Mostrando logs da aplicação:${NC}"
docker logs -f ${CONTAINER_NAME}