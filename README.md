![cover.png](.github/cover.png)

# NFSe PDF API (PHP)

![PHP](https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

API em PHP 8.3 para receber um XML de Nota Fiscal de Serviço Eletrônica (NFSe) e gerar um PDF com os dados da nota.

## Como usar

1. Instale as dependências e prepare o ambiente:

```bash
sh setup.sh
```

2. Inicie a API:

```bash
sh run.sh
```

3. Envie o XML via POST para o endpoint `/gerar-pdf`:

- URL: `http://localhost:3000/gerar-pdf`
- Método: `POST`
- Content-Type: `application/xml`
- Corpo: Cole o XML da NFSe

Exemplo usando `curl`:

```bash
curl --location --request POST 'http://localhost:3000/gerar-pdf' \
--header 'Content-Type: application/xml' \
--data '<xml></xml>'
```

O PDF será retornado como resposta.

4. Parar a API:

```bash
sh stop.sh
```

## Observações
- O layout do PDF pode ser customizado em `src/PdfGenerator.php`. 