const express = require('express');
const bodyParser = require('body-parser');
const xml2js = require('xml2js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.text({ type: 'application/xml' }));

/**
 * Formats a given CNPJ (Cadastro Nacional da Pessoa Jurídica) number string
 * into a standard format with dots, slashes, and dashes.
 *
 * @param {string} cnpj - The raw CNPJ string containing only numeric characters.
 * @return {string} The formatted CNPJ string in the format XX.XXX.XXX/XXXX-XX.
 */
function formatCNPJ(cnpj) {
  return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

/**
 * Formats a Brazilian postal code (CEP) by adding a hyphen between the fifth and sixth digits.
 *
 * @param {string} cep - The unformatted Brazilian postal code consisting of 8 digits.
 * @return {string} The formatted postal code with a hyphen (e.g., 12345-678).
 */
function formatCEP(cep) {
  return cep.replace(/(\d{5})(\d{3})/, '$1-$2');
}

/**
 * Formats a given date string into the format dd/mm/yyyy.
 * If the input date string is already in the dd/mm/yyyy format,
 * or cannot be converted to a valid date, it returns the original string.
 *
 * @param {string} dateStr - The date string to be formatted.
 * @return {string} The formatted date string in dd/mm/yyyy format, or the original string if conversion is not possible.
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    
    // Verifica se a data já está no formato dd/mm/yyyy
    if (dateStr.includes('/')) {
        return dateStr;
    }
    
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            // Se não for possível converter para data, retorna a string original
            return dateStr;
        }
        return date.toLocaleDateString('pt-BR');
    } catch (error) {
        // Em caso de erro, retorna a string original
        return dateStr;
    }
}

/**
 * Converts a numeric value to a currency-formatted string following the 'pt-BR' locale.
 *
 * @param {number|string} value - The numeric value to format as currency.
 * @return {string} A string representing the formatted currency value.
 */
function formatCurrency(value) {
  return parseFloat(value).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Draws a rectangular box on a given document at the specified position and dimensions.
 *
 * @param {Object} doc - The document object on which the rectangle will be drawn.
 * @param {number} x - The x-coordinate of the top-left corner of the rectangle.
 * @param {number} y - The y-coordinate of the top-left corner of the rectangle.
 * @param {number} width - The width of the rectangle.
 * @param {number} height - The height of the rectangle.
 * @return {void} Does not return a value.
 */
function drawBox(doc, x, y, width, height) {
  doc.rect(x, y, width, height).stroke();
}

const fetch = require('node-fetch');


/**
 * Consulta informações de endereço baseadas no CEP informado utilizando a API BrasilAPI.
 *
 * @param {string} cep - O CEP a ser consultado. Aceita formatos com ou sem pontuação.
 * @return {Promise<Object|null>} Retorna um objeto contendo os dados do endereço associado ao CEP
 * se a consulta for bem-sucedida, ou null em caso de erro.
 */
async function consultarCEP(cep) {
    try {
        // Remove caracteres não numéricos do CEP
        const cepLimpo = cep.replace(/\D/g, '');
        const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cepLimpo}`);

        if (!response.ok) {
            throw new Error(`Erro na consulta do CEP: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao consultar CEP:', error);
        return null;
    }
}

app.post('/gerar-pdf', async (req, res) => {
  try {
    const xml = req.body;
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xml);
    const nfse = result['CompNfse']['Nfse']['InfNfse'];

    const prestador = nfse.PrestadorServico;
    const tomador = nfse.TomadorServico;
    const servico = nfse.Servico;
    const valores = servico.Valores;

    const doc = new PDFDocument({ margin: 20, size: 'A4' });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfData);
    });

    // Posicionamento inicial e configurações
    let y = 30;
    const pageMargin = 20;
    const pageWidth = 550;
    const headerHeight = 90;
    const marginLeft = 20;
    
    // Borda externa mais grossa
    doc.lineWidth(2);
    doc.rect(pageMargin, y, pageWidth, headerHeight).stroke();
    
    // Reset para linha mais fina para bordas internas
    doc.lineWidth(0.5);
    
    // Linha vertical de divisão
    const dividerX = pageMargin + 400; // Ponto de divisão entre título e informações
    doc.moveTo(dividerX, y).lineTo(dividerX, y + headerHeight).stroke();
    
    // Título à esquerda (em negrito)
    doc.font('Helvetica-Bold').fontSize(11)
       .text('PREFEITURA MUNICIPAL DE BELO HORIZONTE',
             pageMargin,
             y + 25,
             {
               width: 400,
               align: 'center'
             });

    doc.font('Helvetica').fontSize(9)
       .text('NOTA FISCAL DE SERVIÇOS ELETRÔNICA - NFSe',
             pageMargin + 10,
             y + 40,
             {
               width: 380,
               align: 'center'
             });

    // Informações à direita
    const rightSectionWidth = pageWidth - 400;
    const rightStart = dividerX;
    
    // Linhas horizontais de divisão
    const infoHeight = headerHeight / 3;
    doc.moveTo(rightStart, y + infoHeight).lineTo(pageMargin + pageWidth, y + infoHeight).stroke();
    doc.moveTo(rightStart, y + infoHeight * 2).lineTo(pageMargin + pageWidth, y + infoHeight * 2).stroke();
    
    // Número da NFS-e
    doc.font('Helvetica').fontSize(9)
       .text('Número da NFS-e', 
             rightStart, 
             y + (infoHeight/1.5) - 15,
             {
               width: rightSectionWidth,
               align: 'center'
             });
    doc.text(nfse.Numero, 
             rightStart, 
             y + (infoHeight/2.1) + 5,
             {
               width: rightSectionWidth,
               align: 'center'
             });
    
    // Código de Verificação
    doc.text('Código de Verificação', 
             rightStart, 
             y + (infoHeight * 1.6) - 15,
             {
               width: rightSectionWidth,
               align: 'center'
             });
    doc.text(nfse.CodigoVerificacao, 
             rightStart, 
             y + (infoHeight * 1.4) + 5,
             {
               width: rightSectionWidth,
               align: 'center'
             });
    
    // Data de Emissão
    doc.text('Data de Emissão', 
             rightStart, 
             y + (infoHeight * 2.6) - 15,
             {
               width: rightSectionWidth,
               align: 'center'
             });
    doc.text(formatDate(nfse.DataEmissao || ''), // Adicionado fallback para caso nulo
             rightStart, 
             y + (infoHeight * 2.4) + 5,
             {
               width: rightSectionWidth,
               align: 'center'
             });

    // Ajusta o y para o próximo bloco de conteúdo
    y = y + headerHeight + 20;

    // Bloco do Prestador
    y = 120;
      doc.lineWidth(0.5);
      doc.rect(pageMargin, y, pageWidth, 20).stroke();

      doc.font('Helvetica')
          .fontSize(9)
          .text('PRESTADOR DE SERVIÇO',
              pageMargin,
              y + 5,
              {
                  width: pageWidth,
                  align: 'center'
              });

      // Ajusta y para o próximo conteúdo
      y += 20;

      // Definindo constantes para posicionamento
      const leftMargin = pageMargin + 20;
      const logoWidth = 100;
      const logoHeight = 50;

      // Verifica se o logo existe e adiciona apenas se existir
      const logoPath = path.join(__dirname, 'assets', 'logotipo_solides.png');

      doc.lineWidth(2);
      doc.rect(pageMargin, y, pageWidth, headerHeight).stroke();

      // Reset para linha mais fina para bordas internas
      doc.lineWidth(0.5);

    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, leftMargin, y + 30, {
            width: logoWidth,
            height: logoHeight,
            fit: [logoWidth, logoHeight]
        });
    }

    // Se não houver logo, ajusta o início das informações
    const infoStartX = fs.existsSync(logoPath) ?
        leftMargin + logoWidth + 40 :
        leftMargin;

      // Posição inicial para as informações (após o logo)
      let lineHeight = 15;
      let currentY = y + 10;

      // CPF/CNPJ e Inscrição Municipal na mesma linha
      doc.font('Helvetica-Bold').fontSize(8).text('CPF/CNPJ:', infoStartX, currentY);
      doc.font('Helvetica').text(nfse.CpfCnpj || '10.461.302/0001-10', infoStartX + 50, currentY);

      doc.font('Helvetica-Bold').text('Inscrição Municipal:', infoStartX + 230, currentY);
      doc.font('Helvetica').text(nfse.InscricaoMunicipal || '02343070010', infoStartX + 320, currentY);

      // Nome
      currentY += lineHeight;
      doc.font('Helvetica-Bold').text('Nome:', infoStartX, currentY);
      doc.font('Helvetica').text(nfse.Nome || 'Solides Tecnologia S/A', infoStartX + 50, currentY);

      // Endereço
      currentY += lineHeight;
      doc.font('Helvetica-Bold').text('Endereço:', infoStartX, currentY);
      doc.font('Helvetica').text(nfse.Endereco || 'Rua Tomé de Souza, 845 SALA 201 SALA 301 SALA 401 - Savassi',
          infoStartX + 50, currentY);

      // CEP
      currentY += lineHeight;
      doc.font('Helvetica-Bold').text('CEP:', infoStartX, currentY);
      doc.font('Helvetica').text(nfse.Cep || '30140-136', infoStartX + 50, currentY);

      // Município e UF na mesma linha
      currentY += lineHeight;
      doc.font('Helvetica-Bold').text('Município:', infoStartX, currentY);
      doc.font('Helvetica').text(nfse.Municipio || 'Belo Horizonte', infoStartX + 50, currentY);

      doc.font('Helvetica-Bold').text('UF:', infoStartX + 250, currentY);
      doc.font('Helvetica').text(nfse.Uf || 'MG', infoStartX + 270, currentY);

      // Atualiza y para a próxima seção
      y = currentY + lineHeight + 5;

      doc.lineWidth(0.5);
      doc.rect(pageMargin, y, pageWidth, 20).stroke();

      doc.font('Helvetica')
          .fontSize(9)
          .text('TOMADOR DO SERVIÇO',
              pageMargin,
              y + 5,
              {
                  width: pageWidth,
                  align: 'center'
              });

      // Ajusta y para o próximo conteúdo
      y += 20;

      // // Bloco do Tomador
      doc.lineWidth(2);
      doc.rect(pageMargin, y, pageWidth, headerHeight).stroke();

      // Reset para linha mais fina para bordas internas
      doc.lineWidth(0.5);

    
    // Altura total do bloco do tomador
    const blockHeight = 120;  // Ajustado para acomodar todas as informações
    
    // Desenha a borda do bloco
    // doc.lineWidth(0.5);
    // doc.rect(marginLeft, y, pageWidth - (2 * marginLeft), blockHeight).stroke();
    
    // Define as posições e espaçamentos
    const leftCol = marginLeft + 10;
    const rightCol = marginLeft + 350;
    lineHeight = 15;
    currentY = y + 10;

    // CPF/CNPJ à esquerda
    doc.font('Helvetica-Bold').fontSize(8).text('CPF/CNPJ:', leftCol, currentY);
    doc.font('Helvetica').text(formatCNPJ(tomador.IdentificacaoTomador.CpfCnpj.Cnpj), leftCol + 50, currentY);

    // Inscrição Municipal à direita
    doc.font('Helvetica').text('Inscrição Municipal:', rightCol, currentY);
    doc.font('Helvetica').text(tomador.InscricaoMunicipal || '-', rightCol + 90, currentY);

    // Inscrição Estadual abaixo da Inscrição Municipal
    currentY += lineHeight;
    doc.font('Helvetica').text('Inscrição Estadual:', rightCol, currentY);
    doc.font('Helvetica').text(tomador.InscricaoEstadual || '-', rightCol + 90, currentY);

    // Nome abaixo do CPF/CNPJ
    currentY += lineHeight - 15;
    doc.font('Helvetica-Bold').text('Nome:', leftCol, currentY);
    doc.font('Helvetica').text(tomador.RazaoSocial, leftCol + 50, currentY);

    // Endereço
    currentY += lineHeight;
    doc.font('Helvetica-Bold').text('Endereço:', leftCol, currentY);
    doc.font('Helvetica').text(
        `${tomador.Endereco.Endereco}, ${tomador.Endereco.Numero} ${tomador.Endereco.Complemento || ''}`,
        leftCol + 50, currentY
    );

    // CEP e Bairro na mesma linha
    currentY += lineHeight;
    doc.font('Helvetica-Bold').text('CEP:', leftCol, currentY);
    doc.font('Helvetica').text(formatCEP(tomador.Endereco.Cep), leftCol + 50, currentY);
    
    doc.font('Helvetica-Bold').text('Bairro:', rightCol, currentY);
    doc.font('Helvetica').text(tomador.Endereco.Bairro, rightCol + 50, currentY);

    // Município e UF na mesma linha
      const zipCodeData = await consultarCEP(tomador.Endereco.Cep)
    currentY += lineHeight;
    doc.font('Helvetica-Bold').text('Município:', leftCol, currentY);
    doc.font('Helvetica').text(zipCodeData.city, leftCol + 50, currentY);
    
    doc.font('Helvetica-Bold').text('UF:', rightCol, currentY);
    doc.font('Helvetica').text(tomador.Endereco.Uf, rightCol + 30, currentY);

    // Atualiza y para a próxima seção
    y = y + blockHeight - 30;

      doc.lineWidth(0.5);
      doc.rect(pageMargin, y, pageWidth, 20).stroke();

      doc.font('Helvetica')
          .fontSize(9)
          .text('DISCRIMINAÇÃO DOS SERVIÇOS',
              pageMargin,
              y + 5,

              {
                  width: pageWidth,
                  align: 'center'
              });

      // Ajusta y para o próximo conteúdo
      y += 20;

      // // Bloco Descriminação
      doc.lineWidth(2);
      doc.rect(pageMargin, y, pageWidth, 250).stroke();

      // Reset para linha mais fina para bordas internas
      doc.lineWidth(0.5);
      doc.fontSize(9).font('Helvetica').text(servico.Discriminacao, marginLeft + 10, y + 10, { width: pageWidth - 20 });

    // Bloco do Valor
      y = y + blockHeight + 130;

      doc.lineWidth(0.5);
      doc.rect(pageMargin, y, pageWidth, 20).stroke();

      doc.font('Helvetica')
          .fontSize(9)
          .text(`VALOR TOTAL DO SERVIÇO R$ ${formatCurrency(valores.ValorServicos)}`,
              pageMargin,
              y + 5,
              {
                  width: pageWidth,
                  align: 'center'
              });

      // Ajusta y para o próximo conteúdo
      y += 20;

       // Bloco
      doc.lineWidth(2);
      doc.rect(pageMargin, y, pageWidth, headerHeight).stroke();

      // Reset para linha mais fina para bordas internas
      doc.lineWidth(0.5);

      y = y + blockHeight - 30;

      doc.lineWidth(0.5);
      doc.rect(pageMargin, y, pageWidth, 20).stroke();

      doc.font('Helvetica')
          .fontSize(9)
          .text(`OUTRAS INFORMAÇÕES`,
              pageMargin,
              y + 5,
              {
                  width: pageWidth,
                  align: 'center'
              });

      // Ajusta y para o próximo conteúdo
      y += 20;

      // Bloco
      doc.lineWidth(2);
      doc.rect(pageMargin, y, pageWidth, headerHeight).stroke();

      // Reset para linha mais fina para bordas internas
      doc.lineWidth(0.5);
      doc.fontSize(9).text(
          `Para consultar a autenticidade acesse: Site https://bhissdigital.pbh.gov.br/nfse/pages/consultaNFS-e_cidadao.jsf ` +
          `CNPJ: ${formatCNPJ(prestador.IdentificacaoPrestador.Cnpj)}. NFSe: ${nfse.Numero}. ` +
          `Código de verificação: ${nfse.CodigoVerificacao}.`,
          40,
          790,
          { align: 'center', width: 515 }
      );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao processar o XML');
  }
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});