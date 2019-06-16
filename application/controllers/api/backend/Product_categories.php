<?php
defined('BASEPATH') OR exit('No direct script access allowed');
define('MODEL', 'backend/');
class Product_categories extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->model(MODEL."product_categories_model");
	}
	
	function index(){
		$data = $this->product_categories_model->get();
		echo jsonify($data);
	}
	
	function add(){
		$this->form_validation->set_rules('title','Title','required|trim');
		if($this->form_validation->run()){
			$data = $this->product_categories_model->add();
			if($data){
				$response['status']= 'success';
				$response['message']= 'Product Added';
				echo jsonify($response);
		    }
		}else{
			$response['status'] = 'error';
			$error['title'] = form_error('title'); 
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	function update(){
		$this->form_validation->set_rules('product_id','Product id','required|trim');
		$this->form_validation->set_rules('title','Title','required|trim');
		if($this->form_validation->run()){
			$data = $this->product_categories_model->update();
			if($data){
				$response['status']= 'success';
				$response['message']= 'Product updated';
				echo jsonify($response);
		    }
		}else{
			$response['status'] = 'error';
			$error['title'] = form_error('title'); 
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	function update_status(){
		$data = $this->product_categories_model->update_status();
		if($data){
			$response['status']= 'success';
			$response['message']= 'Product updated';
			echo jsonify($response);
		}
	}
	
	function delete($product_id){
		
	}
}
