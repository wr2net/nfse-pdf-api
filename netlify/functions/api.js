const express = require('express');
const serverless = require('@netlify/functions');
const bodyParser = require('body-parser');

// Importe suas rotas e configurações existentes aqui
const app = express();
const router = express.Router();

// Configuração do middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Suas rotas existentes devem ser movidas para cá
router.post('/generate-pdf', async (req, res) => {
    // Sua lógica existente de geração de PDF
});

app.use('/.netlify/functions/api', router);

// Exporta o handler para o Netlify Functions
exports.handler = serverless.handler(app);