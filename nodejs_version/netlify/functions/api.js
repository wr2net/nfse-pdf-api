const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const pdfGenerator = require('../../src/pdf-generator');

const app = express();

// Configuração do middleware para aceitar XML
app.use(bodyParser.text({ type: 'application/xml' }));

// Handler compartilhado
async function handlePdfGeneration(req, res) {
    try {
        const result = await pdfGenerator.generatePDF(req.body, res);
        res.type('application/pdf').send(result);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).send('Erro ao gerar PDF');
    }
}

// Rota única para o Netlify Functions
app.post('/gerar-pdf', handlePdfGeneration);

// Exportação correta para Netlify Functions
module.exports.handler = serverless(app);