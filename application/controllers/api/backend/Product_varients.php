<?php
defined('BASEPATH') OR exit('No direct script access allowed');
define('MODEL', 'backend/');
class Product_varients extends CI_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->model("common/get_model");
		$this->load->model(MODEL."product_varients_model");
	}
	
	function index($product_id){
		$data = $this->product_varients_model->get($product_id);
		echo jsonify($data);
	}
	
	function add(){
		$this->form_validation->set_rules('variant_title','Variant Title','required|trim');
		$this->form_validation->set_rules('mrp','MRP','required|trim');
		$this->form_validation->set_rules('buy_price','Buy Price','required|trim');
		$this->form_validation->set_rules('sell_price','Sell Price','required|trim');
		if($this->form_validation->run()){
			$data = $this->product_varients_model->add();
			if($data){
				$response['status']= 'success';
				$response['message']= 'Variant Added';
				echo jsonify($response);
		    }
		}else{
			$response['status'] = 'error';
			$error['variant_title'] = form_error('variant_title'); 
			$error['mrp'] 			= form_error('mrp'); 
			$error['buy_price'] 	= form_error('buy_price'); 
			$error['sell_price'] 	= form_error('sell_price'); 
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	function update(){
		$this->form_validation->set_rules('product_variant_id','Product Variant Id','required|trim');
		$this->form_validation->set_rules('variant_title','Variant Title','required|trim');
		$this->form_validation->set_rules('mrp','MRP','required|trim');
		$this->form_validation->set_rules('buy_price','Buy Price','required|trim');
		$this->form_validation->set_rules('sell_price','Sell Price','required|trim');
		if($this->form_validation->run()){
			$data = $this->product_varients_model->update();
			if($data){
				$response['status']= 'success';
				$response['message']= 'Variant updated';
			echo jsonify($response);
		    }
		}else{
			$response['status'] = 'error';
			$error['variant_title'] = form_error('variant_title'); 
			$error['mrp'] 			= form_error('mrp'); 
			$error['buy_price'] 	= form_error('buy_price'); 
			$error['sell_price'] 	= form_error('sell_price'); 
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	function update_status(){
		$data = $this->product_varients_model->update_status();
		if($data){
			$response['status']= 'success';
			$response['message']= 'Product updated';
			echo jsonify($response);
		}
	}
	
	function delete($product_id){
		
	}
}
