<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Templates extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('smart/templates_model');
		$this->load->model('smart/templates_default_model');
		//$this->load->helper('smart/Login');
		//check_login();
		$GLOBALS['business_id']	= 1;
		$GLOBALS['user_id']	= 1;
		$GLOBALS['cdn_url'] = $this->config->item('cdn_url');
		$GLOBALS['template_default_path'] = 'uploads/default/templates/';
		$GLOBALS['template_path'] = 'uploads/business/'.$GLOBALS['business_id'].'/templates/'; 
	}
	// add template from default template like copy
	public function add(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_002'),"Template_category"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('template_default_id','Template Default Id','trim|required');
		if($this->form_validation->run()){
			$data['template_default_id'] = $this->input->post('template_default_id');
			$row = $this->templates_default_model->get_template_default($data);
			$data = array(
					'template_type'			=>	$row['row']->template_type,
					'template_default_id'	=>	$row['row']->template_default_id,
					'business_id'			=>	$GLOBALS['business_id'],
					'thumbnail'				=>	'thambnail.png',
					'status' 				=> 	1,
					'created_by'			=>	$GLOBALS['user_id'],
					'created_date'			=>	time(), //date("F d, Y h:i:s", $timestamp)
					'modified_date'			=>	time(),
					'modified_by'			=>	$GLOBALS['user_id'],
				);
			$output = $this->templates_model->add($data);
			if($output['success'] == 1){
				//update code for filename & thumbnail
				$this->create_template_file($data['template_default_id'], $output['id']);
				$response['status'] = 'success';
				$response['message'] = replaceSingleTag($this->lang->line('msg_suc_002'),"Template");
				$response['insert_id'] = $output['id'];
			}
		}else{
			$error['template_default_id'] 	= form_error('template_default_id');
			$response['message'] 			= $error;
		}
		echo $this->jsonify($response);
	}
	// get single template data with its template id 
	public function get(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"Template"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_id','Template Id','trim|required');
		if($this->form_validation->run()){
			$data = array('template_id'=>$this->input->post('template_id'));
			//get single template data with its template id
			$data = $this->templates_model->get_template($data);
			if($data['success']){
				$response['status'] = 'success';
				$response['message']= $data['row'];  
			}
		}else{
			$error['template_id'] 	= form_error('template_id');
			$response['message'] 	= $error;
		}
		echo $this->jsonify($response);
	}
	public function get_html(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"Template"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('template_id','Template Id','trim|required');
		if($this->form_validation->run()){
			$data = array('template_id'=>$this->input->post('template_id'));
			//get single template data with its template id
			$data = $this->templates_model->get_template($data);
			if($data['success']){
				$response['status'] = 'success';
				$url = $this->config->item('cdn_url').'uploads/business/'.$data['row']['business_id'].'/templates/template_'.$data['row']['template_id'].'/index.html';
				$arr_context_options=array(
						"ssl"=>array(
							"verify_peer"=>false,
							"verify_peer_name"=>false,
						),
				);
				$filecontent =  file_get_contents($url, false, stream_context_create($arr_context_options));
				$response['message']= $filecontent;  
			}
		}else{
			$response['status']  	= 'error';
			$error['template_id'] 	= form_error('template_id');
			$response['message'] 	= $error;
		}
		echo $this->jsonify($response);
	}
	//create Template File for new template
	public function create_template_file($source_id, $destination_id){
		$responce = array('success'=>0,'msg'=>'upload failed','preview'=>'index.html','draft'=>'draft.html');
		$this->load->helper('smart/upload_helper');
		$responce['success'] = 1;
		$source = $GLOBALS['cdn_url'].$GLOBALS['template_default_path'].'template_'.$source_id.'/index.html';
		$filename = mt_rand().'.html';
		$local_destination = FCPATH.'uploads\temp\\'.$filename;
		$arr_context_options=array(
			"ssl"=>array(
				"verify_peer"=>false,
				"verify_peer_name"=>false,
			),
		);

		$filecontent =  file_get_contents($source, false, stream_context_create($arr_context_options));
		$file = fopen($local_destination, "wb");
		fputs($file, $filecontent);
		fclose($file);
		
		$draftS3 = $GLOBALS['template_path'].'template_'.$destination_id.'/draft.html';
		$indexS3 = $GLOBALS['template_path'].'template_'.$destination_id.'/index.html';
		$res = upload_file($local_destination, $indexS3, false);
		if($res['status']){
			upload_file($local_destination, $draftS3);
			$responce['success'] = 1;
			$responce['msg'] = '';
		}
		return $responce;
	}
	
}
