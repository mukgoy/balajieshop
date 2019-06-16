<?php
defined('BASEPATH') OR exit('No direct script access allowed');
define('MODEL', 'backend/');
class Products extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->model(MODEL."products_model");
	}
	
	function index(){
		$data = $this->products_model->get();
		echo jsonify($data);
	}
	
	function add(){
		
	}
	
	function update($product_id){
		
	}
	
	function delete($product_id){
		
	}
}
