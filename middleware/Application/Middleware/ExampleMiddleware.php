<?php

namespace Application\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ExampleMiddleware implements MiddlewareInterface
{
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (!defined('BAZCONSTANT')) {
            define('BAZCONSTANT', 'Hello from Example Middleware');
        }

        $_SERVER['middleware']['example'] = rand(1, 10);

        return $handler->handle($request);
    }
}
