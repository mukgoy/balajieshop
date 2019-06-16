<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Welcome extends CI_Controller {
	
	public function index(){
		// sleep(20);
		$this->load->view('index');
	}
	public function timeer(){
		sleep($_GET['t']);
		//$this->load->view('index');
	}
}
