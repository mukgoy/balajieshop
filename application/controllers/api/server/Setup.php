<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Setup extends CI_Controller{

	public function __construct(){
		parent::__construct();
		
	}
				
	function index(){
		$this->db->query("SET GLOBAL group_concat_max_len = 1000000");
	}
	
}
