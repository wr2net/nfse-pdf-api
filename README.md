![cover.png](.github/cover.png)

# NFSe PDF API

[![Netlify Status](https://api.netlify.com/api/v1/badges/399a316a-33ef-4e34-8720-0051bd19e3da/deploy-status)](https://app.netlify.com/projects/nf-pdf/deploys)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

API em Node.js para receber um XML de Nota Fiscal de Serviço Eletrônica (NFSe) e gerar um PDF com os dados da nota.

## Como usar

1. Instale as dependências:

```bash
sh setup.sh
```

2. Inicie a API:

```bash
sh run.sh
```

3. Envie o XML via POST para o endpoint `/gerar-pdf`:

- URL: `https://nf-pdf.fawacom.com.br/gerar-pdf`
- Método: `POST`
- Content-Type: `application/xml`
- Corpo: Cole o XML da NFSe

Exemplo usando `curl`:

```bash
curl --location --request POST 'https://nf-pdf.fawacom.com.br/gerar-pdf' \
--data '<xml></xml>'
```

O PDF será retornado como resposta.

4. Parar a API:

```bash
sh stop.sh
```

## Observações
- O layout do PDF pode ser customizado. 