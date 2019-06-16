<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Apps extends CI_Controller{

	public function __construct(){
		parent::__construct();
		
		$this->load->helper('smart/application_messages_helper'); 
	}
	
	public function jsonify($array){
		if(isset($_REQUEST['draw'])){
			$array['draw'] = $_REQUEST['draw']+1;
		}
		if(isset($_REQUEST['current_page'])){
			$array['current_page'] = $_REQUEST['current_page'];
		}
		if(isset($_REQUEST['items_per_page'])){
			$array['items_per_page'] = $_REQUEST['items_per_page'];
		}
		if(isset($_REQUEST['order_by'])){
			$array['order_by'] = $_REQUEST['order_by'];
		}
		if(isset($_REQUEST['order_type'])){
			$array['order_type'] = $_REQUEST['order_type'];
		}
		if(isset($_REQUEST['callback'])){
			$array['callback'] = $_REQUEST['callback'];
		}
		if(isset($_REQUEST['redirect_url'])){
			$array['redirect_url'] = $_REQUEST['redirect_url'];
		}
		return json_encode($array);
	}
	
}
