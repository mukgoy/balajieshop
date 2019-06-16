<?php
defined('BASEPATH') OR exit('No direct script access allowed');


$GLOBALS['server_islive'] = false;
$GLOBALS['server_isprocessor'] = false;


$GLOBALS['public_html']	= '';
$GLOBALS['base_folder']	= 'SagSmart-v1.0/';
$GLOBALS['base_path']	= $GLOBALS['public_html'].$GLOBALS['base_folder'];
$config['base_path']	= $GLOBALS['public_html'].$GLOBALS['base_folder'];

$config['http']= (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";
$config['base_url'] = $config['http'] . $_SERVER['HTTP_HOST']. '/' .$GLOBALS['base_path'];
$config['processing_server_url'] = $config['http'] . $_SERVER['HTTP_HOST']. '/' .$GLOBALS['base_path'];
$config['bucket']	= 'sagsmart-v1.0-dev';




if($GLOBALS['server_islive']){
	$config['ffmpeg']= '/usr/local/bin/ffmpeg/ffmpeg';
	$config['ffprobe']= '/usr/local/bin/ffmpeg/ffprobe';
	$config['mp4box']= '/usr/local/bin/MP4Box';
	$config['cdn_url'] = 'https://sagsmart-v1.0-dev.s3.amazonaws.com/';
	$config['aws_url'] = 'https://sagsmart-v1.0-dev.s3.amazonaws.com/';
}else{
	$config['ffmpeg']= 'C:\ffmpeg\bin\ffmpeg';
	$config['ffprobe']= 'C:\ffmpeg\bin\ffprobe';
	$config['mp4box']= 'C:\GPAC\MP4Box';
	$config['cdn_url'] = $config['http'] . $_SERVER['HTTP_HOST']. '/' .$GLOBALS['base_path'];
	$config['aws_url'] = $config['http'] . $_SERVER['HTTP_HOST']. '/' .$GLOBALS['base_path'];
}