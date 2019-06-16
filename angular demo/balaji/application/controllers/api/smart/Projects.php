<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Projects extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('smart/projects_model');
		//$this->load->helper('smart/Login');
		//check_login();
		$GLOBALS['business_id']	= 1;
		$GLOBALS['user_id']	= 1;
	}
	// For Pagination of All records
	public function index(){
		$draw   		= isset($_GET['draw']) ? $this->input->get('draw') : 1;
		//get all parameters
		$data = $this->get_peramitter();
		//get all records with total records
		$records 	= $this->projects_model->get($data);
		$draw++;
		$output = array(
					"total_record"	=>	$records['total_record'],
					"records"		=>	$records['records'],
					"draw"			=>	$draw,
				);
    	$response 	= array('status'=>'success','message'=>$output,'callback'=>'','redirect_type'=>'angular','redirect_url'=>'');
	    echo $this->jsonify($response);
	}
	// For Pagination of All records
	public function list_with_reports(){
		$draw   		= isset($_GET['draw']) ? $this->input->get('draw') : 1;
		//get all parameters
		$data = $this->get_peramitter();
		//get all records with total records
		$records	= $this->projects_model->list_with_report($data);
		$draw++;
		$output = array(
					"total_record"	=>	$records['total_record'],
					"records"		=>	$records['records'],
					"draw"			=>	$draw,
				);
		$response 	= array('status'=>'success','message'=>$output,'callback'=>'','redirect_type'=>'angular','redirect_url'=>'');
	    echo $this->jsonify($response);
	}
	//get excel file according to parameters in page
	public function get_excel(){
		//get all parameters
		$data = $this->get_peramitter();
		//get all records with total records
		$records	= $this->projects_model->list_with_report($data);
		//create required fields
		foreach($records['records'] as $key=>$value){
			$return[] = array(
						'Project Name' => $value['title'],
						'Created On' =>date("F d, Y h:i:s", $value['created_date']),
						'Unique Viewers' => $value['unique_viewer'],
						'Conversions' => $value['conversions'],
						'Conversions Rate' => $value['conversions_rate'],
						);
		}
		//load excel library 
		$this->load->library("excel");
		//call export_excel function to generate excel file
		$this->excel->export_excel($return);
	}
	//get all parameters for pagination
	public function get_peramitter(){
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
			'business_id'	=>$GLOBALS['business_id']
		);
		if(isset($_GET['fields'])){$data['fields'] = $_GET['fields'];}
		if(isset($_GET['search'])){$data['search'] = $_GET['search'];}
		if(isset($_GET['items_per_page'])){$data['items_per_page'] = $_GET['items_per_page'];}
		if(isset($_GET['current_page'])){$data['start'] = ($_GET['current_page']-1)*$data['items_per_page'];}
		if(isset($_GET['order_by'])){$data['order_by'] = $_GET['order_by'];}
		if(isset($_GET['order_type'])){$data['order_type'] = $_GET['order_type'];}
		if(isset($_GET['date_start'])){$data['date_start'] = strtotime($_GET['date_start']);}
		if(isset($_GET['date_end'])){$data['date_end'] = strtotime($_GET['date_end']);}
		return $data;
	}
	// Add project
	public function add(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_002'),"Project"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('title','Title','trim|required');
		if($this->form_validation->run()){
			$data = array(
			'title'			=>	$this->input->post('title'),
			'business_id'	=>	$GLOBALS['business_id'],
			'status' 		=> 	1,
			'created_by'	=>	$GLOBALS['user_id'],
			'created_date'	=>	time(), 
			'modified_date'	=>	time(),
			'modified_by'	=>	$GLOBALS['user_id'],
			);
			//add new project and return insert project id
			$output = $this->projects_model->add($data);
			if($output['success']== 1){
				$response['status'] 	= 'success';
				$response['message'] 	= replaceSingleTag($this->lang->line('msg_suc_002'),"Project");
				$response['insert_id'] 	= $output['id'];
			}
			if($output['success'] == 2){
				$response['message'] 	= replaceSingleTag($this->lang->line('msg_err_005'),"Project");
			}
		}else{
			$error['title'] 	 = form_error('title');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}
	//update exist project with project_id
	public function update(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_001'),"Project"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('project_id','project_id','trim|required');
		if($this->form_validation->run()){
			$data = array(
			'status' 		=> 	1,
			'modified_date'	=>	time(),
			'modified_by'	=>	$GLOBALS['user_id'],
			);
			$condition = array(
				'project_id'	=>	$this->input->post('project_id'),
				'business_id'	=>	$GLOBALS['business_id']
			);
			if(isset($_POST['title'])){ $data['title'] = $this->input->post('title');}
			//update project with parameters and project_id
			$output = $this->projects_model->update($data,$condition);
			if($output['success']==1){
				$response['status']  = 'success';
				$response['message'] = replaceSingleTag($this->lang->line('msg_suc_001'),"Project");
			}
			if($output['success'] == 2){
				$response['message'] = replaceSingleTag($this->lang->line('msg_err_005'),"Project");
			}
		}else{
			$error['project_id'] 	 = form_error('project_id');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}
	// delete single or multiple project with its id or multiple id's
	public function delete(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_003'),"Project"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('project_id','project_id','required');
		if($this->form_validation->run())
		{
			//explode multiple id's to array;
			$id =  explode(',', $this->input->post('project_id'));
				$data = array(
				'modified_by'=>$GLOBALS['user_id'],
				'modified_date'=>time(),
				'status'=>0
				);
				$condition = array('project_id'=>$id,'business_id'=>$GLOBALS['business_id']);
				//delete with modified data and coditions ids
				$output = $this->projects_model->delete($data , $condition);
			if($output){
				$response 	= array('message'=>replaceSingleTag($this->lang->line('msg_suc_003'),"Project"),'callback'=>'','redirect_type'=>'angular','redirect_url'=>''); 
				$response['status'] = 'success';
			}
		}else{
			$error['project_id'] 	 = form_error('project_id');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}
	// get a single project whole data with its id
	public function get(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"Project"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('project_id','Project Id','required');
		if($this->form_validation->run())
		{
			$data = array('project_id'=>$this->input->post('project_id'),'business_id'=>$GLOBALS['business_id']);
			//get a single project with its id
			$data = $this->projects_model->get_project($data);
			if($data['success']){
				$response['status'] = 'success';
				$response['message']= $data['row'];  
			}
		}else{
			$error['project_id'] 	 = form_error('project_id');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}
}
