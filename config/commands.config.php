<?php

// The PHP script to use when forking processes.
$baseConfig['async_process_bin'] = $baseConfig['BASEDIR']
    . DIRECTORY_SEPARATOR
    . 'bin'
    . DIRECTORY_SEPARATOR
    . 'process.php';

// List of commands to run asynchronously.
$baseConfig['async_commands'] = [
    \Application\Commands\ReadProductsCommand::class,
    \Application\Commands\WriteProductsCommand::class,
];