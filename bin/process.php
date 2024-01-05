<?php

declare(strict_types = 1);

if (PHP_SAPI !== 'cli') {
    die('This is a CLI-based application only. Aborting...');
}

if (!defined('BASEDIR')) {
    define('BASEDIR', dirname(dirname(__FILE__)));
}

require_once BASEDIR . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

$webapp = Ascmvc\Mvc\App::getInstance();

$baseConfig = $webapp->boot();

$webapp->initialize($baseConfig);

$cmdapp = new Symfony\Component\Console\Application();

foreach ($baseConfig['async_commands'] as $asyncCommandName) {
    $asyncCommand = new $asyncCommandName($webapp);

    $cmdapp->add($asyncCommand);
}

$cmdapp->run();