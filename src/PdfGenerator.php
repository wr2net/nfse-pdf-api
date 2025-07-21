<?php
namespace App;

use Mpdf\Mpdf;

class PdfGenerator
{
    /**
     * Gera um PDF a partir do XML da NFSe.
     * @param string $xml
     * @return string PDF binário
     * @throws \Exception
     */
    public static function generate(string $xml): string
    {
        // Parse do XML (exemplo básico)
        $nfse = simplexml_load_string($xml);
        if ($nfse === false) {
            throw new \Exception('XML inválido');
        }

        // Montar HTML para o PDF (exemplo simples)
        $html = '<h1>NFSe</h1>';
        $html .= '<pre>' . htmlspecialchars($xml) . '</pre>';
        // Aqui você pode customizar o layout conforme necessário

        // Gerar PDF com mPDF
        $mpdf = new Mpdf();
        $mpdf->WriteHTML($html);
        return $mpdf->Output('', 'S'); // Retorna PDF como string
    }
} 