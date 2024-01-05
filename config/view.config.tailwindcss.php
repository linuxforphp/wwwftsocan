<?php

$baseConfig['templateManager'] = 'Plates';

$baseConfig['templates'] = [
    'templateDir' => $baseConfig['BASEDIR'] . DIRECTORY_SEPARATOR . 'templates' . DIRECTORY_SEPARATOR . 'plates_tailwindcss' . DIRECTORY_SEPARATOR,
    'compileDir' => $baseConfig['BASEDIR'] . DIRECTORY_SEPARATOR . 'templates_c' . DIRECTORY_SEPARATOR,
    'configDir' => $baseConfig['BASEDIR'] . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR,
    'cacheDir' => $baseConfig['BASEDIR'] . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR,
];

$baseConfig['view'] = [
    'urlbaseaddr' => $baseConfig['URLBASEADDR'],
    'logo' => $baseConfig['URLBASEADDR'] . 'img/logo.png',
    'lightmvc_logo' => $baseConfig['URLBASEADDR'] . 'img/lightmvc_logo.png',
    'lightmvc_logo_large' => $baseConfig['URLBASEADDR'] . 'img/lightmvc_logo_large.png',
    'favicon' => $baseConfig['URLBASEADDR'] . 'favicon.ico',
    'appname' => $baseConfig['appName'],
    'title' => "Skeleton Application",
    'author' => 'Andrew Caya',
    'description' => 'Small CRUD application',
    'css' =>
        [
            $baseConfig['URLBASEADDR'] . 'css/tailwind.min.css',

        ],
    'js' =>
        [
            $baseConfig['URLBASEADDR'] . 'js/jquery.min.js',

        ],
    'jsscripts' =>
        [
            //"<script>\n\t\tfunction getPage(page) {\n\n\t\t\tvar url = page;\n\n\t\t\tjq( \"#pageBody\" ).load( url );\n\n\t\t}\n\t</script>\n",

        ],
    'bodyjs' => 0,
    'links' =>
        [
            'Home' => $baseConfig['URLBASEADDR'] . 'index',
            'Products' => $baseConfig['URLBASEADDR'] . 'products/index',
            'Documentation' => 'https://lightmvc-framework.readthedocs.io/en/latest/?badge=latest',
            'API Doc' => 'http://apidocs.lightmvcframework.net/',

        ],
    'links-left' =>
        [
            'Home' => $baseConfig['URLBASEADDR'] . 'index',
            'Products' => $baseConfig['URLBASEADDR'] . 'products/index',

        ],
    'links-right' =>
        [
            'Documentation' => 'https://lightmvc-framework.readthedocs.io/en/latest/?badge=latest',
            'API Doc' => 'http://apidocs.lightmvcframework.net/',

        ],
    'navMenu' =>
        [
            'Home' => $baseConfig['URLBASEADDR'] . 'index',

        ],

];