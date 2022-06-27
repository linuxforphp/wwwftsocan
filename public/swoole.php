<?php

declare(strict_types = 1);

if (!defined('BASEDIR')) {
    define('BASEDIR', dirname(dirname(__FILE__)));
}

if (!file_put_contents(BASEDIR . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR . 'dummy.txt', 'test')
    || !file_put_contents(BASEDIR . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'dummy.txt', 'test')
    || !file_put_contents(BASEDIR . DIRECTORY_SEPARATOR . 'templates_c' . DIRECTORY_SEPARATOR . 'dummy.txt', 'test')
) {
    unlink(BASEDIR . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR . 'dummy.txt');
    unlink(BASEDIR . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'dummy.txt');
    unlink(BASEDIR . DIRECTORY_SEPARATOR . 'templates_c' . DIRECTORY_SEPARATOR . 'dummy.txt');

    die('The \'cache\', \'logs\' and \'templates_c\' folders must be writable.');
}

unlink(BASEDIR . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR . 'dummy.txt');
unlink(BASEDIR . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'dummy.txt');
unlink(BASEDIR . DIRECTORY_SEPARATOR . 'templates_c' . DIRECTORY_SEPARATOR . 'dummy.txt');

$logFile = BASEDIR . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'log.txt';

if (PHP_SAPI !== 'cli') {
    $data =
        'Swoole must run from the CLI (i.e. \'composer run-swoole\').'
        . ' Host and port settings can be changed in the composer.json file.'
        . PHP_EOL;

    // Write the contents to the file,
    // using the FILE_APPEND flag to append the content to the end of the file
    // and the LOCK_EX flag to prevent anyone else writing to the file at the same time
    file_put_contents($logFile, $data, FILE_APPEND | LOCK_EX);

    die('A critical error has occurred.  Please contact your system administrator.');
}

require_once BASEDIR . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

$host = (string) $argv[1] ?? '127.0.0.1';

$port = (int) $argv[2] ?? 9501;

function getStaticFile(
    swoole_http_request $request,
    swoole_http_response $response,
    array $static
) : bool {
    $staticFile =
        BASEDIR
        . DIRECTORY_SEPARATOR
        . 'public'
        . DIRECTORY_SEPARATOR
        . $request->server['request_uri'];
    if (! file_exists($staticFile)) {
        return false;
    }
    $type = pathinfo($staticFile, PATHINFO_EXTENSION);
    if (! isset($static[$type])) {
        return false;
    }
    $response->header('Content-Type', $static[$type]);
    $response->sendfile($staticFile);
    return true;
}

function buildGlobals($request)
{
    foreach ($request->server as $key => $value) {
        $_SERVER[strtoupper($key)] = $value;
    }
    if (property_exists($request, 'get') && !empty($request->get)) {
        $_GET = $request->get;
    } else {
        $_GET = [];
    }
    if (property_exists($request, 'post') && !empty($request->post)) {
        $_POST = $request->post;
    } else {
        $_POST = [];
    }
    if (property_exists($request, 'cookie') && !empty($request->cookie)) {
        $_COOKIE = $request->cookie;
    } else {
        $_COOKIE = [];
    }
    if (property_exists($request, 'files') && !empty($request->files)) {
        $_FILES = $request->files;
    } else {
        $_FILES = [];
    }
    if (property_exists($request, 'header')) {
        foreach ($request->header as $key => $value) {
            $_SERVER['HTTP_'.strtoupper($key)] = $value;
        }
    }
}

$http = new swoole_http_server($host, $port);

//$http->setGlobal(HTTP_GLOBAL_ALL);

$http->on("start", function ($server) {
    printf("HTTP server started at %s:%s\n", $server->host, $server->port);
    printf("Master  PID: %d\n", $server->master_pid);
    printf("Manager PID: %d\n", $server->manager_pid);
});

$static = [
    'css'  => 'text/css',
    'js'   => 'text/javascript',
    'png'  => 'image/png',
    'ico'  => 'image/x-icon',
    'gif'  => 'image/gif',
    'jpg'  => 'image/jpg',
    'jpeg' => 'image/jpg',
    'mp4'  => 'video/mp4'
];

$http->on("request", function ($request, $response) use ($static) {
    ob_start();

    buildGlobals($request);

    if (getStaticFile($request, $response, $static)) {
        return;
    }

    $app = new Ascmvc\Mvc\App(true);

    $baseConfig = $app->boot();

    $config = new \Ascmvc\Session\Config($baseConfig['session']);
    $sessionManager = \Ascmvc\Session\SessionManager::getSessionManager($request, $response, $config, true);

    try {
        $sessionManager->start();
    } catch (\Throwable $exception){
        die($exception->getMessage());
    }

    $app->setSessionManager($sessionManager);

    if($baseConfig['env'] === 'production') {
        set_error_handler(function($errno, $errstr, $errfile, $errline, array $errcontext) {
            // error was suppressed with the @-operator
            if (0 === error_reporting()) {
                return false;
            }

            throw new \Exception($errstr);
        });

        try {

            $app->initialize($baseConfig)->run();

        } catch (\Throwable $e) {

            $logFile = BASEDIR . DIRECTORY_SEPARATOR . 'logs' . DIRECTORY_SEPARATOR . 'log.txt';

            $data = $e->getMessage() . PHP_EOL;

            // Write the contents to the file,
            // using the FILE_APPEND flag to append the content to the end of the file
            // and the LOCK_EX flag to prevent anyone else writing to the file at the same time
            file_put_contents($logFile, $data, FILE_APPEND | LOCK_EX);

            echo 'A critical error has occurred.  Please contact your system administrator.';

        }
    } else {
        require_once BASEDIR . DIRECTORY_SEPARATOR . 'config' . DIRECTORY_SEPARATOR . 'error_handling.config.php';

        $app->initialize($baseConfig);
        $eventManager = $app->getEventManager();
        $eventManager->clearListeners(\Ascmvc\Mvc\AscmvcEvent::EVENT_FINISH);
        $app->run();
    }

    $finalResponse = $app->getResponse();

    $headers = $finalResponse->getHeaders();

    unset($app);

    foreach ($headers as $header => $value) {
        $response->header($header, $value[0]);
    }

    $response->status($finalResponse->getStatusCode());
    $sessionManager->persist();
    $response->end($finalResponse->getBody()->__toString());
});

$http->start();