const express = require('express');
const bodyParser = require('body-parser');
const pdfGenerator = require('./pdf-generator');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do middleware para aceitar XML
app.use(bodyParser.text({ type: 'application/xml' }));

// Rota base para desenvolvimento local
app.post('/gerar-pdf', handlePdfGeneration);

// Rota para o Netlify Functions
app.post('/.netlify/functions/api/gerar-pdf', handlePdfGeneration);

// Handler compartilhado
async function handlePdfGeneration(req, res) {
    try {
        const result = await pdfGenerator.generatePDF(req.body);
        res.type('application/pdf').send(result);
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).send('Erro ao gerar PDF');
    }
}

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});