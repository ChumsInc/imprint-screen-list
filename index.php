<?php

use chums\ui\WebUI2;
use chums\user\Groups;

require_once 'autoload.inc.php';

$ui = new WebUI2([
    'title' => 'Imprint Screen List',
    'requiredRoles' => [Groups::CS, Groups::SALES, Groups::IMPRINT],
    'bodyClassName' => 'container-fluid',
    'contentFile' => 'body.inc.php'
]);
$ui->addManifestJSON('public/js/manifest.json')
    ->render();
