<?php

defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Projects extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/projects_model');		
	}
	
	public function index(){
		$response = $this->projects_model->get();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function add(){
		$this->form_validation->set_rules('title','Title','required|trim');
		if($this->form_validation->run()){			
			$data['title'] 			= $this->input->post('title');
			$data['business_id']	= $GLOBALS['business_id'];
			$data['slug'] 			= $this->input->post('slug');
			$data['description'] 	= $this->input->post('description');
			$data['thumbnail']   	= $this->input->post('thumbnail');
			$data['created_date'] 	= time();
			$data['created_by']   	= $this->input->post('created_by');
			$data['modified_date'] 	= time();
			$data['modified_by']  	= $this->input->post('modified_by');
			$data['status']       	= $this->input->post('status');
			$data  = $this->projects_model->add($data);
			if($data){
				$response['status']= 'success';
				$response['message']= 'Title Added';
				echo $this->jsonify($response);
		    }else{
		    	$response['status']= 'error';
				$response['message']= 'Title Not Added';
		    	echo $this->jsonify($response);
		    }
		}else{
			$response['status'] = 'error';
			$error['title'] = form_error('title'); 
 			$response['message'] = $error;
 			echo $this->jsonify($response);
		}
		
	}
	
	public function update(){
		$this->form_validation->set_rules('title','Title','required|trim');
		if($this->form_validation->run()){
			$data['title'] 	= $this->input->post('title');
			$where['id']    =  $id = $this->input->post('id');
			$data 			= $this->projects_model->update($data,$where);
			if($data){
				$response['status'] = 'success';
				$response['message']= 'Updated Successfully';
				echo $this->jsonify($response);
			}else{
				$response['status'] = 'error';
				$response['message']= 'Updated Not Successfully';
				echo $this->jsonify($response);
			}
		}
		else{
			$response['status']   = 'error';
			$error['title']       = form_error('title');
			$response['message']  = $error;
			echo $this->jsonify($response);

			}
		
	}
	
	public function delete(){		
		   $id = $this->input->post('id');
		   $data['id'] = $id;
		   $data['id'] = explode(',', $data['id']);
		   $data = $this->projects_model->delete($data);
		   if($data){
		   		$response['status']  = 'success';
		   		$response['message'] = 'Deleted Successfully';
		   		echo $this->jsonify($response);
		   }else{
		   		$response['status']  = 'error';
		   		$response['message'] = 'Deleted Not Successfully';
		   		echo $this->jsonify($response);
		   }
		 
	}
	
}
