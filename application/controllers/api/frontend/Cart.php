<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Cart extends Apps {

	public function __construct(){
		parent::__construct();
		$this->load->model('common/get_model');
		$this->load->model('frontend/cart_model');		
		
	}
	
	public function getcart(){
		$user_id = $this->input->post('user_id');
		$order_id = $this->get_model->field('orders', 'order_id', ['user_id'=>$user_id, 'order_status'=>0]);
		$response = $this->cart_model->getcart($order_id);
		echo jsonify($response);
	}
	
	public function addtocart(){		
		$order_id = $this->cart_model->addtocart();
		$response = $this->cart_model->getcart($order_id);
		echo jsonify($response);
	}
	
	public function update_cart_quantity(){		
		$order_id = $this->cart_model->update_cart_quantity();
		$response = $this->cart_model->getcart($order_id);
		echo jsonify($response);
	}
	
}
