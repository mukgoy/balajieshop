<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class View extends CI_Controller {
	public function index()
	{
		if(current(explode('.',$_SERVER['HTTP_HOST'])) == 'bms'){
			$this->load->view('app/bms');
		}else{
			$this->load->view('app/index');
		}
	}
}
