<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Video_subtitle extends Apps{
	public function __construct(){
		parent::__construct();
		$this->load->model('video/video_subtitle_model');
		
	}
	public function index(){
		$this->form_validation->set_rules('video_id','Video','required');
		if($this->form_validation->run()){
			$GLOBALS['video_id'] = $this->input->post('video_id');
			$response = $this->video_subtitle_model->get();
			if(!$response){
				$response = array('subtitles'=>'','video_id'=>$GLOBALS['video_id']);
			}
			$response['status'] = 'success';
		}
		else{
			$error['video_id']		=	form_error('video_id');
			$response['message']	= 	$error;
			$response['status'] 	=	'error';
		}
		echo $this->jsonify($response);
	}
	
	public function update(){
		$this->form_validation->set_rules('video_id','Video','required');
		$this->form_validation->set_rules('subtitles','Subtitles','required');
		if($this->form_validation->run()){
			$GLOBALS['video_id'] = $this->input->post('video_id');
			if($this->video_subtitle_model->update()){
				$response['status'] = 'success';
				$response['message']= 'Updated Successfully';
			}else{
				$response['status'] = 'error';
				$response['message']= 'Updated Not Successfully';
			}
		}else{
			$response['status'] 	=	'error';
			$error['subtitles']		=	form_error('subtitles');
			$error['video_id']		=	form_error('video_id');
			$response['message']	= 	$error;
		}
		echo $this->jsonify($response);
	}
}