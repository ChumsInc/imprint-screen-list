<?php


/**
 * @package Chums
 * @subpackage ProjectedDemands
 * @author Steve Montgomery
 * @copyright Copyright &copy; 2013, steve
 */

require_once ("autoload.inc.php");
require_once ('access.inc.php');

$bodyPath = "apps/website-categories";
$title = "Website Categories";
$description = "";

$ui = new WebUI($bodyPath, $title, $description, true, true);
$ui->version = "2019-03-07";
$ui->bodyClassName = 'container-fluid';
$ui->AddCSS("public/css/styles.css");
$ui->addManifest('public/js/manifest.json');
//$ui->AddJS("public/js/manifest.d41d8cd98f00b204e980.js");
//$ui->addChunkManifest('public/js/chunk-manifest.json');
/**
 * Changelog:
 */


$ui->Send();
