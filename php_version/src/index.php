<?php
require __DIR__ . '/../vendor/autoload.php';

use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Message\ResponseInterface as Response;
use Slim\Factory\AppFactory;
use App\PdfGenerator;

$app = AppFactory::create();

$app->post('/gerar-pdf', function (Request $request, Response $response) {
    $xml = (string)$request->getBody();
    try {
        $pdfContent = PdfGenerator::generate($xml);
        $response = $response->withHeader('Content-Type', 'application/pdf');
        $response->getBody()->write($pdfContent);
        return $response;
    } catch (\Throwable $e) {
        $response->getBody()->write('Erro ao gerar PDF: ' . $e->getMessage());
        return $response->withStatus(500);
    }
});

$app->run(); 