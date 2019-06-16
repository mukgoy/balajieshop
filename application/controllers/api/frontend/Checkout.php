<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Get extends Apps {

	public function __construct(){
		parent::__construct();
		$this->load->model('common/get_model');		
	}
	
	public function categories(){
		$this->load->model('frontend/category_model');		
		$response = $this->category_model->get();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
}
