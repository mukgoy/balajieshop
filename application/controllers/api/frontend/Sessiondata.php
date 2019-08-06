<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Sessiondata extends Apps {
	
	public function register(){
		$data = $this->session->userdata('userdata');
		echo jsonify($data);
	}
	
	
}
