<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$config['islive'] = false;

$config['public_html']	= '';
$config['base_folder']	= 'balajieshop/';
$config['base_path']	= $config['public_html'].$config['base_folder'];

$config['http']= (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";
$config['base_url'] = $config['http'] . $_SERVER['HTTP_HOST']. '/' .$config['base_path'];


if($config['islive']){
	$config['cdn_url'] = $config['base_url'];
}else{
	$config['cdn_url'] = $config['base_url'];
}