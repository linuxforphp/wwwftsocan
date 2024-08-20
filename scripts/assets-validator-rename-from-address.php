<?php

$json = json_decode(file_get_contents(__DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'validatorlist.json'), true);

foreach ($json['validators'] as $validator) {
    //var_dump($validator['nodeId'] . '.png');
    if (file_exists(__DIR__ . DIRECTORY_SEPARATOR . $validator['address'] . '.png')) {
        rename(__DIR__ . DIRECTORY_SEPARATOR . $validator['address'] . '.png', __DIR__ . DIRECTORY_SEPARATOR . $validator['nodeId'] . '.png');
    }
}
