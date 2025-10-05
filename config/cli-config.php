<?php
// vendor/bin/doctrine orm:convert-mapping --namespace=Application\\Models\\Entity\\ --from-database annotation ./models
// vendor/bin/doctrine orm:generate-entities --generate-annotations -- ./models
// OR
// vendor/bin/doctrine orm:convert-mapping --namespace=Application\\Models\\Entity\\ --filter=Tokens --from-database annotation ./models
// vendor/bin/doctrine orm:generate-entities --filter=Tokens --generate-annotations -- ./models
//
// vendor/bin/doctrine orm:generate-repositories ./models/
//
// vendor/bin/doctrine orm:generate-entities --generate-annotations --update-entities -- ./models
// OR
// vendor/bin/doctrine orm:generate-entities --generate-annotations --regenerate-entities -- ./models

use Ascmvc\Mvc\App;
use Doctrine\ORM\Tools\Console\ConsoleRunner;

if (!defined('BASEDIR')) {
    define('BASEDIR', dirname(dirname(__FILE__)));
}

require_once BASEDIR . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';

$app = App::getInstance();

$baseConfig = $app->boot();

$app->initialize($baseConfig);

$connName = $app->getBaseConfig()['events']['read_conn_name'];

$entityManager = $app->getServiceManager()[$connName];

return ConsoleRunner::createHelperSet($entityManager);