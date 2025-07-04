const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const pdfGenerator = require('../../src/pdf-generator');

const app = express();
const router = express.Router();

// Configuração do middleware para aceitar XML
app.use(bodyParser.text({ type: 'application/xml' }));

// Rota para geração de PDF
router.post('/gerar-pdf', async (req, res) => {
    try {
        const result = await pdfGenerator.generatePDF(req.body, res);
        res.type('application/pdf').send(result);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).send('Erro ao gerar PDF');
    }
});

app.use('/.netlify/functions/api', router);

// Exporta o handler para o Netlify Functions
module.exports.handler = serverless(app);