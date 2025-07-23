```toml
name = 'Generate'
method = 'POST'
url = 'http://localhost:3000/gerar-pdf'
sortWeight = 1000000
id = 'cb4f8d31-b1f1-492b-98ce-749c229ba056'

[[headers]]
key = 'Content-Type'
value = 'application/xml'

[body]
type = 'XML'
raw = '''
<CompNfse xmlns="http://www.abrasf.org.br/nfse.xsd">
    <Nfse xmlns="http://www.abrasf.org.br/nfse.xsd" versao="1.00">
        <InfNfse Id="nfse">
            <Numero>202500000182274</Numero>
            <CodigoVerificacao>9992f288</CodigoVerificacao>
            <DataEmissao>2025-06-13T11:34:06</DataEmissao>
            <IdentificacaoRps>
                <Numero>666587</Numero>
                <Serie>1</Serie>
                <Tipo>1</Tipo>
            </IdentificacaoRps>
            <DataEmissaoRps>2025-06-12</DataEmissaoRps>
            <NaturezaOperacao>1</NaturezaOperacao>
            <OptanteSimplesNacional>2</OptanteSimplesNacional>
            <IncentivadorCultural>2</IncentivadorCultural>
            <Competencia>2025-06-12T01:00:00</Competencia>
            <OutrasInformacoes>Empresa beneficiada pelo PROEMP. ISSQN não sujeito à retenção na fonte em BH; Certificado de Incentivo Fiscal-nº 235-A Chave de acesso no Ambiente de Dados Nacional: 31062001210461302000110250000018227425069845056606.</OutrasInformacoes>
            <Servico>
                <Valores>
                    <ValorServicos>227.90</ValorServicos>
                    <ValorDeducoes>0.00</ValorDeducoes>
                    <ValorPis>0.00</ValorPis>
                    <ValorCofins>0.00</ValorCofins>
                    <ValorInss>0.00</ValorInss>
                    <ValorIr>0.00</ValorIr>
                    <ValorCsll>0.00</ValorCsll>
                    <IssRetido>2</IssRetido>
                    <BaseCalculo>227.90</BaseCalculo>
                    <ValorLiquidoNfse>227.90</ValorLiquidoNfse>
                    <DescontoIncondicionado>0.00</DescontoIncondicionado>
                </Valores>
                <ItemListaServico>01.05</ItemListaServico>
                <CodigoTributacaoMunicipio>10500188</CodigoTributacaoMunicipio>
                <Discriminacao>Mensalidade Solides DP |Implementacao Solides DP.||Val Aprox Tributos R$ 31,52 13,83 . Fonte IBPT.|;Outras Informacoes ;;Empresa beneficiada pelo PROEMP. ;ISSQN nao sujeito a retencao na fonte em BH; Certificado de Incentivo Fiscal-n 87-A;</Discriminacao>
                <CodigoMunicipio>3106200</CodigoMunicipio>
            </Servico>
            <PrestadorServico>
                <IdentificacaoPrestador>
                    <Cnpj>10461302000110</Cnpj>
                    <InscricaoMunicipal>02343070010</InscricaoMunicipal>
                </IdentificacaoPrestador>
                <RazaoSocial>SOLIDES TECNOLOGIA S/A</RazaoSocial>
                <NomeFantasia>SOLIDES</NomeFantasia>
                <Endereco>
                    <Endereco>RUA TOME DE SOUZA</Endereco>
                    <Numero>845</Numero>
                    <Complemento>SALA 201 SALA 301 SALA 40</Complemento>
                    <Bairro>Savassi</Bairro>
                    <CodigoMunicipio>3106200</CodigoMunicipio>
                    <Uf>MG</Uf>
                    <Cep>30140136</Cep>
                </Endereco>
            </PrestadorServico>
            <TomadorServico>
                <IdentificacaoTomador>
                    <CpfCnpj>
                        <Cnpj>03464494000153</Cnpj>
                    </CpfCnpj>
                </IdentificacaoTomador>
                <RazaoSocial>Kurlan Camargo Da Silva</RazaoSocial>
                <Endereco>
                    <Endereco>R DEMETRIO RIBEIRO</Endereco>
                    <Numero>174</Numero>
                    <Bairro>CENTRO</Bairro>
                    <CodigoMunicipio>4322004</CodigoMunicipio>
                    <Uf>RS</Uf>
                    <Cep>95840000</Cep>
                </Endereco>
                <Contato>
                    <Email>kurlancamargo@gmail.com</Email>
                </Contato>
            </TomadorServico>
            <OrgaoGerador>
                <CodigoMunicipio>3106200</CodigoMunicipio>
                <Uf>MG</Uf>
            </OrgaoGerador>
        </InfNfse>
        <Signature xmlns="http://www.w3.org/2000/09/xmldsig#" Id="NfseAssSMF_nfse">
            <SignedInfo>
                <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
                <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
                <Reference URI="#nfse">
                    <Transforms>
                        <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
                        <Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
                    </Transforms>
                    <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
                    <DigestValue>xv/1jy1ZgwB0F0jw/ZX+ozEU8f0=</DigestValue>
                </Reference>
            </SignedInfo>
            <SignatureValue>dPZNdADYS1D8UEhE8rYAy6+HxqtX9KRXGRXD7nPVquZQdmOTKlZ0WuLY+Yna0LIJYRJUhtFYZwLJrDU2LZaZ/7brwu2vjeGOmXb7bDzZECeoo0jf4eyr5BzCeead7xRWDcIWLsXE0gWfG9TF7i0gYryyH7+5dp7ckg7p5Ac3Iwl190yNHpvatiG38iaCWXSL8EuHVCkd3FEoq4WGlvyX5gwCtR6CZmYas4MUZeULV0VKck771YB5YBfM3//41ohKER8L8uHFooNms3zk8dby7zGj8/ac4ZFIzpWG5iP+bXS8Zr0r4YuX1A9DGgacz/13uA7Y99CbWCluX4Q1bgUaCA==</SignatureValue>
            <KeyInfo>
                <X509Data>
                    <X509Certificate>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</X509Certificate>
                </X509Data>
            </KeyInfo>
        </Signature>
    </Nfse>
</CompNfse>'''
```
