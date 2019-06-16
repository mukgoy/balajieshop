<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Products extends Apps {

	public function __construct(){
		parent::__construct();
		$this->load->model('frontend/product_model');		
		
	}
	
	public function index(){
		$response = $this->product_model->get();
		echo jsonify($response);
	}
	
	public function search_autocomplete(){
		$response = $this->product_model->search_autocomplete();
		echo jsonify($response);
	}
}
