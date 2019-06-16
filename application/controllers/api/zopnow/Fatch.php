<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Fatch extends CI_Controller {
	
	public function index($page=7){
		$data = file_get_contents("http://www.zopnow.com/masala-c.tpl?page=".$page);
		print_r(json_decode($data,1));
	}
	
	
	
}
