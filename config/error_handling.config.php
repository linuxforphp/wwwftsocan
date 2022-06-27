<?php

use Whoops\Run as Whoops;
use Whoops\Handler\PrettyPageHandler;
//use Whoops\Handler\JsonResponseHandler;

$whoops = new Whoops();
$handler = new PrettyPageHandler();

$handler->setApplicationPaths([BASEDIR]);
$whoops->allowQuit(true);
$whoops->pushHandler($handler);

//$handler2 = new JsonResponseHandler();
//$handler2->addTraceToOutput(true);
//$whoops->pushHandler($handler2);

$whoops->register();