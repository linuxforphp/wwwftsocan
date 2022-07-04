<?php

$baseConfig['middleware'] = [
    function ($request, $handler) {
        if ((isset($request->getServerParams()['QUERY_STRING'])
                && (strpos($request->getServerParams()['QUERY_STRING'], 'fbclid=') !== false
                    || strpos($request->getServerParams()['QUERY_STRING'], 'ref=') !== false))
            || (isset($request->getServerParams()['REDIRECT_QUERY_STRING'])
                && (strpos($request->getServerParams()['REDIRECT_QUERY_STRING'], 'fbclid=') !== false
                    || strpos($request->getServerParams()['REDIRECT_QUERY_STRING'], 'ref=') !== false))
        ) {
            $requestUriArray = explode('?', $request->getServerParams()['REQUEST_URI']);

            if (empty($requestUriArray[0]) || $requestUriArray[0] === '/') {
                $requestUri = '/index';
            } else {
                $requestUri = $requestUriArray[0];
            }

            $response = new \Laminas\Diactoros\Response();
            $response = $response->withStatus('302');
            $response = $response->withHeader('Location', $requestUri);
            return $response;
        }

        return $handler->handle($request);
    },
    /*'/foo' => function ($req, $handler) {
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
    ],*/
];
