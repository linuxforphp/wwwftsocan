<?php

$baseConfig['events'] = [
    // PSR-14 compliant Event Bus.
    'psr14_event_dispatcher' => \Ascmvc\EventSourcing\EventDispatcher::class,
    // Different read and write connections allow for simplified (!) CQRS. :)
    'read_conn_name' => 'dem1',
    'write_conn_name' => 'dem1',
];

$baseConfig['eventlog'] = [
    'enabled' => true,
    'doctrine' => [
        'log_conn_name' => 'dem1',
        'entity_name' => \Application\Log\Entity\EventLog::class,
    ],
    // Leave empty to log everything, including the kitchen sink. :)
    // If you you start whitelisting events, it will blacklist everything else by default.
    'log_event_type' => [
        'whitelist' => [
            \Ascmvc\EventSourcing\Event\WriteAggregateCompletedEvent::class,
        ],
        'blacklist' => [
            //\Ascmvc\EventSourcing\Event\AggregateEvent::class,
        ],
    ],
];