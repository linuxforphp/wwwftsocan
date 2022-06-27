<?php

$baseConfig['session'] = [
    'enabled' => true,
    'psr6_cache_pool' => \Ascmvc\Session\Cache\DoctrineCacheItemPool::class,
    'doctrine_cache_driver' => \Doctrine\Common\Cache\FilesystemCache::class,
    //'doctrine_cache_driver' => \Doctrine\Common\Cache\XcacheCache::class,
    //'doctrine_cache_driver' => \Doctrine\Common\Cache\RedisCache::class,
    //'doctrine_cache_driver' => \Doctrine\Common\Cache\MemcachedCache::class,
    //'doctrine_cache_driver' => \Doctrine\Common\Cache\MemcacheCache::class,
    'doctrine_filesystem_cache_directory' => BASEDIR . DIRECTORY_SEPARATOR . 'cache' . DIRECTORY_SEPARATOR,
    'doctrine_cache_server_params' => [
        'host' => '127.0.0.1',
        'port' => 6379, // redis
        //'port' => 11211 // memcached/memcache
    ],
    'session_name' => 'PHPSESSION',
    'session_path' => '/',
    'session_domain' => '',
    'session_secure' => false,
    'session_httponly' => false,
    'session_id_length' => 32,
    'session_id_type' => 1,
    'session_storage_prefix' => 'ascmvc',
    'session_token_regeneration' => 60 * 30, // 30 minutes
    'session_expire' => 60 * 60, // 60 minutes
];