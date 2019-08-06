<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Apps extends CI_Controller{

	public function __construct(){
		parent::__construct();
		$this->load->helper('app');
		$this->form_validation->set_error_delimiters('','');
		
		$GLOBALS['user_profile']	= array(
			'user_id'	=> 0,
			'name'		=> 'Guest',
			'email'		=> '',
			'phone'		=> '',
		);
	}
				
	
	
}
