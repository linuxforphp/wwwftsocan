<?php

$baseConfig['routes'] = [
    [
        'GET',
        '/',
        'index',
    ],
    [
        'GET',
        '/index[/{action}]',
        'index',
    ],
    [
        'GET',
        '/delegate[/{action}]',
        'delegate',
    ],
    /*[
        ['GET', 'POST'],
        '/products[/{action}[/{id:[0-9]+}]]',
        'products',
    ],
    [
        'GET',
        '/baz[/{action}]',
        'specialmodule/index',
    ],
    [
        'GET',
        '/admin[/{action}]',
        'specialmodule/index',
    ],*/
];