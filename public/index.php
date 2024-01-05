<?php

declare(strict_types = 1);

ob_start();

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

require_once BASEDIR . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

// Instantiate the loader
// $loader = new Ascmvc\Mvc\Psr4Autoloader;

// Register the autoloader
// $loader->register();

// Register the base directories for the namespace prefix
// $loader->addNamespace('Foo\Bar', '/path/to/packages/foo-bar/src');

$app = Ascmvc\Mvc\App::getInstance();

$baseConfig = $app->boot();

$config = new \Ascmvc\Session\Config($baseConfig['session']);
$sessionManager = \Ascmvc\Session\SessionManager::getSessionManager(null, null, $config, true);

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

    $app->initialize($baseConfig)->run();
}

$sessionManager->persist();

flush();

exit;
