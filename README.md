# NFSe PDF API

API em Node.js para receber um XML de Nota Fiscal de Serviço Eletrônica (NFSe) e gerar um PDF com os dados da nota.

## Como usar

1. Instale as dependências:

```bash
npm install
```

2. Inicie a API:

```bash
node index.js
```

3. Envie o XML via POST para o endpoint `/gerar-pdf`:

- URL: `http://localhost:3000/gerar-pdf`
- Método: `POST`
- Content-Type: `application/xml`
- Corpo: Cole o XML da NFSe

Exemplo usando `curl`:

```bash
curl -X POST http://localhost:3000/gerar-pdf \
  -H "Content-Type: application/xml" \
  --data-binary @sua_nota.xml \
  --output nota.pdf
```

O PDF será retornado como resposta.

## Observações
- O layout do PDF é simples e pode ser customizado.
- Para produção, adicione validações e autenticação conforme necessário. 