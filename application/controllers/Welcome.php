<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {
	
	public function index(){
		if(strpos($_SERVER['REQUEST_URI'], 'backend') !== false){
			$this->load->view('backend');
		}else{
			$this->load->view('frontend');
		}
	}
	
}
