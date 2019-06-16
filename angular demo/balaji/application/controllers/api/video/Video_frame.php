<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Video_frame extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/video_frame_model');		
	}
	public function index(){
		$response = $this->video_frame_model->get();
		$response['status'] = 'success';
		echo $this->jsonify($response);

	}
	public function update(){
		$this->form_validation->set_rules('frame_id','Frame','required');
		if($this->form_validation->run()){
		$data 					= $this->video_frame_model->update();
			if($data){
				$response['status'] = 'success';
				$response['message']= 'Updated Successfully';
				echo $this->jsonify($response);
			}else{
				$response['status'] = 'error';
				$response['message']= 'Updated Not Successfully';
				echo $this->jsonify($response);
			}
		}else{
			$response['status'] 		=	'error';
			$error['frame_id'] 			= form_error('frame_id');
			$response['message'] 		= $error;
 			echo $this->jsonify($response);
		}
	}
}