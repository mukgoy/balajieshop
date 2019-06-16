<?php

defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Video_details extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/video_details_model');		
	}
	
	public function index(){
		$response = $this->video_details_model->get();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function update(){
		$this->form_validation->set_rules('title','Title','required|trim');
		$this->form_validation->set_rules('video_id','video','required|trim');
		if($this->form_validation->run()){			
			$data = $this->video_details_model->update();
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
	
}
