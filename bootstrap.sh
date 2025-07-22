#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Diretório base do projeto
BASE_DIR=$(pwd)

# Função para executar script em um diretório específico
execute_in_directory() {
    local dir=$1
    local script=$2
    local message=$3
    
    echo -e "${GREEN}$message${NC}"
    cd "$BASE_DIR/$dir" || {
        echo -e "${RED}Erro: Diretório $dir não encontrado${NC}"
        return 1
    }
    
    if [ -f "$script" ]; then
        ./$script
    else
        echo -e "${RED}Erro: Script $script não encontrado em $dir${NC}"
    fi
    
    cd "$BASE_DIR"
}

# Função para exibir o menu
show_menu() {
    echo -e "${GREEN}=== Menu de Operações ===${NC}"
    echo "1. Setup NodeJs Version"
    echo "2. Setup PHP Version"
    echo "3. Start NodeJs Version"
    echo "4. Start PHP Version"
    echo "5. Stop NodeJs Version"
    echo "6. Stop PHP Version"
    echo "7. Lista Serviços Ativos"
    echo "0. Sair"
    echo -n "Digite sua opção: "
}

# Loop principal do menu
while true; do
    show_menu
    read option

    case $option in
        1)
            execute_in_directory "nodejs_version" "setup.sh" "Executando setup do NodeJS..."
            ;;
        2)
            execute_in_directory "php_version" "setup.sh" "Executando setup do PHP..."
            ;;
        3)
            execute_in_directory "nodejs_version" "run.sh" "Iniciando NodeJS..."
            ;;
        4)
            execute_in_directory "php_version" "run.sh" "Iniciando PHP..."
            ;;
        5)
            execute_in_directory "nodejs_version" "stop.sh" "Parando NodeJS..."
            ;;
        6)
            execute_in_directory "php_version" "stop.sh" "Parando PHP..."
            ;;
        7)
            echo -e "${GREEN}Listando serviços ativos:${NC}"
            docker ps
            ;;
        0)
            echo -e "${GREEN}Saindo...${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Opção inválida!${NC}"
            ;;
    esac
    
    echo
    echo -n "Pressione ENTER para continuar..."
    read
    clear
done