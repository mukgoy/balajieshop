<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Templates_default extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('smart/templates_default_model');
		$this->load->model('smart/template_category_model');
		$GLOBALS['business_id']	= 1;
		$GLOBALS['user_id']	= 1;
	}
	// Pagination with all records 
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
		if(isset($_GET['current_page'])){$data['start']= ($_GET['current_page']-1)*$data['items_per_page'];	}
		if(isset($_GET['order_by'])){$data['order_by'] = $_GET['order_by'];}
		if(isset($_GET['order_type'])){$data['order_type'] = $_GET['order_type'];}
		if(isset($_GET['date_start'])){$data['date_start'] = strtotime($_GET['date_start']);}
		if(isset($_GET['date_end'])){$data['date_end'] = strtotime($_GET['date_end']);}
		
		// get all records and total number of records
		$records 	= $this->templates_default_model->get($data);
		$draw++;
		$output = array(
					"total_record"	=>	$records['total_record'],
					"records"		=>	$records['records'],
					"draw"			=>	$draw,
				);
    
		$response 	= array('status'=>'success','message'=>$output,'callback'=>'','redirect_type'=>'angular','redirect_url'=>'');
	    echo $this->jsonify($response);
	}
	// add new Default template 
	public function add(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_002'),"Template_Default"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('title','Title','trim|required');
		$this->form_validation->set_rules('template_type','Template Type','trim|required');
		$this->form_validation->set_rules('template_category_id','Template Category Id','trim|required');
		if($this->form_validation->run()){
			$id =  explode(',',$this->input->post('template_category_id'));
			$data = array(
			'template_type'	=>	$this->input->post('template_type'),
			'title'			=>	$this->input->post('title'),
			'status' 		=> 	1,
			'created_by'	=>	$GLOBALS['user_id'],
			'created_date'	=>	time(), 
			'modified_date'	=>	time(),
			'modified_by'	=>	$GLOBALS['user_id'],
			);
			//add new template with parameters
			$output = $this->templates_default_model->add($data);
			if($output['success'] == 1){
				$response['status'] = 'success';
				$response['message'] = replaceSingleTag($this->lang->line('msg_suc_002'),"Template_Default");
				$response['insert_id'] = $output['id'];
				//create relationship between template with category
				$this->templates_default_model->create_template_relation($id,$output['id']);
				if(isset($_FILES['zip']['name'])){
					// upload Html template with whole file in zip formate
					$res = $this->upload_template_zip($output['id']);
					if($res['success']){
						replaceSingleTag($this->lang->line('msg_err_005'),"Template_Default");
					}
				}
			}  
		}else{
			$error['title'] 	 			= form_error('title');
			$error['template_type'] 		= form_error('template_type');
			$error['template_category_id'] 	= form_error('template_category_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
	//update default template with its parameters
	public function update(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_001'),"Template_Default"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_default_id','Template Default Id','trim|required');
		if($this->form_validation->run()){
			$data = array(
			'template_default_id'	=>	$this->input->post('template_default_id'),
			'status' 				=> 	1,
			'modified_date'			=>	time(),
			'modified_by'			=>	$GLOBALS['user_id'],
			);
			// check zip file if exist then upload on S3
			if(isset($_FILES['zip'])){
				// upload Html template with whole file in zip formate
				$res = $this->upload_template_zip($this->input->post('template_default_id'));
			}
			if(isset($_POST['title'])){ $data['title'] = $this->input->post('title');}
			if(isset($_POST['template_type'])){$data['template_type'] = $this->input->post('template_type');}
			if(isset($_POST['template_category_id'])){
				$id =  explode(',',$this->input->post('template_category_id'));
				//delete exist relationship of Default Template
				$this->templates_default_model->delete_template_relation($this->input->post('template_default_id'));
				//create new relationship of Default Template
				$this->templates_default_model->create_template_relation($id,$this->input->post('template_default_id'));
			}
			// update default template with its parameters
			$output = $this->templates_default_model->update($data);
			if($output['success']==1){
				$response['status'] = 'success';
				$response['message'] = replaceSingleTag($this->lang->line('msg_suc_001'),"Template_Default");
			}
			if($output['success'] == 2){
				$response['message'] = replaceSingleTag($this->lang->line('msg_err_005'),"Template_Default");
			}
		}else{
			$error['template_default_id'] 	= form_error('template_default_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
	// delete Default Template with its id
	public function delete(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_003'),"Template Default"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_default_id','Template Default Id','trim|required');
		if($this->form_validation->run()){
			$id =  explode(',',$this->input->post('template_default_id'));
				$data = array(
				'modified_by'=>$GLOBALS['user_id'],
				'modified_date'=>time(),
				'status'=>0
				);
				$condition = array('template_default_id'=>$id);
				// delete default template with parameters 
				$output = $this->templates_default_model->delete($data,$condition);
				if($output){
					$response 	= array('message'=>replaceSingleTag($this->lang->line('msg_suc_003'),"Template Default"),'callback'=>'','redirect_type'=>'angular','redirect_url'=>'');
					$response['status'] = 'success';
				}
		}else{
			$error['template_default_id'] 	= form_error('template_default_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
	//get a single default template with its default template id
	public function get(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"Template_Default"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_default_id','Template Default Id','trim|required');
		if($this->form_validation->run()){
			$data = array('template_default_id'=>$this->input->post('template_default_id'));
			//get all data of a single default template with its id
			$data = $this->templates_default_model->get_template_default($data);
			if($data['success']){
				$response['status'] = 'success';
				$response['message']= $data['row'];  
			}
		}else{
			$error['template_default_id'] 	= form_error('template_default_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
	// upload Html Template Zip
	public function upload_template_zip($id){
		//$this->load->library('amazons3');
		//$this->load->library('upload');
		$this->load->library('unzip');
		$this->load->helper('smart/upload_helper');
		$this->unzip->allow(array('css', 'js', 'png', 'gif', 'jpeg', 'jpg', 'tpl', 'html', 'swf'));
		$config['upload_path']   = './uploads/temp/'; 
        $config['allowed_types'] = 'zip'; 
    	$new_filename = time().str_replace(' ','-',$_FILES["zip"]['name']);
		$config['file_name'] = $new_filename;
		$responce = array('success'=>0);
		$this->load->library('upload', $config);			
		if($this->upload->do_upload('zip')){
			$responce['success'] = 1;
			$data = array('upload_data' => $this->upload->data());
			$filename = $data['upload_data']['full_path'];
			$folder = $data['upload_data']['file_path'].$data['upload_data']['raw_name'];
			mkdir($folder, 777);
			$this->unzip->extract($data['upload_data']['full_path'],$folder);
			$this->unzip->close();
			if(file_exists($filename)){
				chmod($filename, 0777);
				unlink($filename);
			}
			//scan_directories all file that contain in zip
			$files = scan_directories($folder);
			foreach($files as $file){
				$destination_file = 'uploads/default/templates/template_'.$id.str_replace($folder,'',$file);
				$res = upload_file($file, $destination_file);
				
			}
			// delete Already Exist Directories of any Template
			delete_directory($folder);
		}
		return $responce;
	}
	
}
