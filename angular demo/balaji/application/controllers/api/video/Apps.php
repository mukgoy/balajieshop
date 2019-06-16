<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Apps extends CI_Controller{

	public function __construct(){
		parent::__construct();
		$this->db->query("SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION'");
		// $this->load->helper('smart/login');
		// check_login();
		$GLOBALS['business_id']	= 1;
		$GLOBALS['user_id']	    = 1;
		$GLOBALS['video_id']    = 1;
	}
				
	public function jsonify($array){
		header('Content-Type: application/json');
		if(isset($array['status']) && $array['status']=='error'){
			return json_encode($array);
		}
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
