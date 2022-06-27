<?php

$baseConfig['middleware'] = [
    '/foo' => function ($req, $handler) {
        $response = new \Laminas\Diactoros\Response();
        $response->getBody()->write('FOO!');

        return $response;
    },
    function ($req, $handler) {
        if (! in_array($req->getUri()->getPath(), ['/bar'], true)) {
            return $handler->handle($req);
        }

        $response = new \Laminas\Diactoros\Response();
        $response->getBody()->write('Hello world!');

        return $response;
    },
    '/baz' => \Application\Middleware\ExampleMiddleware::class,
    '/admin' => [
        \Application\Middleware\SessionMiddleware::class,
        \Application\Middleware\ExampleMiddleware::class,
    ],
];
