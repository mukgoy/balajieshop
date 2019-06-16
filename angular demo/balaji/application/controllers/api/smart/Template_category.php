<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Template_category extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('smart/template_category_model');
		//$this->load->helper('smart/Login');
		//check_login();
		$GLOBALS['business_id']	= 1;
		$GLOBALS['user_id']	= 1;
	}
	// pagination records with according to parameters
	public function index(){
		$draw   		= isset($_GET['draw']) ? $this->input->get('draw') : 1;
		$current_page   = isset($_GET['current_page']) ? $this->input->get('current_page') : 1;
		$data = array(
			'fields'		=>'*',
			'search'		=>'',
			'items_per_page'=>0,
			'start'			=>0,
			'order_by'		=>'title',
			'order_type'	=>'DESC',
			'start_date'	=>'',
			'end_date'		=>'',
		);
		if(isset($_GET['fields'])){$data['fields'] = $_GET['fields'];}
		if(isset($_GET['search'])){$data['search'] = $_GET['search'];}
		if(isset($_GET['items_per_page'])){$data['items_per_page'] = $_GET['items_per_page'];}
		if(isset($_GET['current_page'])){$data['start'] = ($_GET['current_page']-1)*$data['items_per_page'];}
		if(isset($_GET['order_by'])){$data['order_by'] = $_GET['order_by'];}
		if(isset($_GET['order_type'])){$data['order_type'] = $_GET['order_type'];}
		if(isset($_GET['date_start'])){$data['date_start'] = strtotime($_GET['date_start']);}
		if(isset($_GET['date_end'])){$data['date_end'] = strtotime($_GET['date_end']);}
		// get all records and total number of records 
		$records 	= $this->template_category_model->get($data);
		$draw++;
		$output = array(
					"total_record"	=>	$records['total_record'],
					"records"		=>	$records['records'],
					"draw"			=>	$draw,
				);
    	$response 	= array('status'=>'success','message'=>$output,'callback'=>'','redirect_type'=>'angular','redirect_url'=>'');
	    echo $this->jsonify($response);
	}
	//add new template category if not exist
	public function add(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_002'),"Template_category"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('title','Title','trim|required');
		$this->form_validation->set_rules('template_type','Template Type','trim|required');
		if($this->form_validation->run()){
			$data = array(
			'template_type'	=>	$this->input->post('template_type'),
			'title'			=>	$this->input->post('title'),
			'status' 		=> 	1,
			'created_by'	=>	$GLOBALS['user_id'],
			'created_date'	=>	time(), 
			'modified_date'	=>	time(),
			'modified_by'	=>	$GLOBALS['user_id'],
			);
			// add new template with parameters
			$output = $this->template_category_model->add($data);
			if($output['success']==1){
				$response['status'] 	= 'success';
				$response['message'] 	= replaceSingleTag($this->lang->line('msg_suc_002'),"Template_category");
				$response['insert_id']	= $output['id'];
			}
			if($output['success'] == 2){
				$response['message'] 	= replaceSingleTag($this->lang->line('msg_err_005'),"Template_category");
			}
		}else{
			$error['title'] 	 	= form_error('title');
			$error['template_type'] = form_error('template_type');
			$response['message'] 	= $error;
		}
		
		echo $this->jsonify($response);
	}
	// update exist template category 
	public function update(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_001'),"Template_category"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_category_id','Template Category Id','trim|required');
		if($this->form_validation->run()){
			$data = array(
			'template_category_id'	=>	$this->input->post('template_category_id'),
			'status' 				=> 	1,
			'modified_date'			=>	time(),
			'modified_by'			=>	$GLOBALS['user_id'],
			);
			if(isset($_POST['title'])){ $data['title'] = $this->input->post('title');}
			if(isset($_POST['template_type'])){$data['template_type'] = $this->input->post('template_type');}
			//update the template category with parameters
			$output = $this->template_category_model->update($data);
			if($output['success'] == 1){
				$response['status'] = 'success';
				$response['message'] = replaceSingleTag($this->lang->line('msg_suc_001'),"Template_category");
			}
			if($output['success'] == 2){
				$response['message'] 	= replaceSingleTag($this->lang->line('msg_err_005'),"Template_category");
			}
		}else{
			$error['template_category_id'] 	= form_error('template_category_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
	// delete the single or multiple id's if exist
	public function delete(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_003'),"Template_category"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_category_id','Template Category Id','trim|required');
		if($this->form_validation->run()){
			$id =  explode(',',$this->input->post('template_category_id'));
				$data = array(
				'modified_by'=>$GLOBALS['user_id'],
				'modified_date'=>time(),
				'status'=>0
				);
				$condition = array('template_category_id'=>$id);
				// delete the exist template category if exist 
				$output = $this->template_category_model->delete($data,$condition);
				if($output){
					$response 	= array('message'=>replaceSingleTag($this->lang->line('msg_suc_003'),"Template_category"),'callback'=>'','redirect_type'=>'angular','redirect_url'=>''); 
					$response['status'] = 'success';
				}
		}else{
			$error['template_category_id'] 	= form_error('template_category_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
	// get single template category record with template category id
	public function get(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"Template_category"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_category_id','Template Category Id','trim|required');
		if($this->form_validation->run()){
			$data = array('template_category_id'=>$this->input->post('template_category_id'));
			$data = $this->template_category_model->get_template_category($data);
			if($data['success']){
				$response['status'] = 'success';
				$response['message']= $data['row'];  
			}
		}else{
			$error['template_category_id'] 	= form_error('template_category_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
}
