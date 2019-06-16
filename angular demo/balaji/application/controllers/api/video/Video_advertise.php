<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Video_advertise extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/video_advertise_model');		
	}
	public function index(){
		$response = $this->video_advertise_model->get();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	public function add(){
		$this->form_validation->set_rules('video_id','Video','required|trim');
		$this->form_validation->set_rules('title','Title','required|trim');
		$this->form_validation->set_rules('video_time','Video Time','required|trim');
		$this->form_validation->set_rules('type','Type','required|trim');
		$this->form_validation->set_rules('skip_time','Skip Time','required|trim');
		if($this->input->post('type') == 'image'){			
			$this->form_validation->set_rules('image_url','Image','trim|callback_validate_require_image');
		}elseif($this->input->post('type') == 'text'){
			$this->form_validation->set_rules('text_color','Text color','required');
			$this->form_validation->set_rules('background_color', 'Background color','required');
			$this->form_validation->set_rules('text_title', 'Text title','required');
			$this->form_validation->set_rules('link_url', 'Link url','required');
		}
		elseif ($this->input->post('type') == 'html') {
			$this->form_validation->set_rules('html_url', 'Html url','required');				
				}		
		if($this->form_validation->run()){		
		$data = $this->video_advertise_model->add();
		if($data){
				$response['status']= 'success';
				$response['message']= 'Advertise Added';
				echo $this->jsonify($response);
		    }else{
		    	$response['status']= 'error';
				$response['message']= 'Advertise Not Added';
		    	echo $this->jsonify($response);
		    }
		}else{
			$response['status'] 	= 'error';
			$error['video_id'] 		= form_error('video_id');
			$error['title'] 		= form_error('title');
			$error['video_time'] 	= form_error('video_time');
			$error['type'] 			= form_error('type');
			$error['skip_time'] 	= form_error('skip_time');
			$error['image_url'] 	= form_error('image_url');
			$error['link_url'] 		= form_error('link_url');
			$error['image_url'] 	= form_error('text_color');
			$error['image_url'] 	= form_error('background_color');
			$error['image_url'] 	= form_error('text_title');
			$error['image_url'] 	= form_error('link_url');
			$error['image_url'] 	= form_error('html_url');			
 			$response['message'] = $error;
 			echo $this->jsonify($response);
		}
	}

	public function validate_require_image(){
		if(isset($_POST['image_url']) || isset($_Files['image_file'] )){
			return true;
		}
		return false;

	}
	public function update(){
		$this->form_validation->set_rules('video_id','Video','required');
		$this->form_validation->set_rules('advert_id','Advert','required|trim');
		$this->form_validation->set_rules('title', 'Title','required|trim');
		$this->form_validation->set_rules('video_time', 'Video time','required|trim');
		if($this->form_validation->run()){
			$data = $this->video_advertise_model->update();
			if($data){
				$response['status'] 	= 'success';
				$response['message'] 	= 'Updated Successfully';
				echo $this->jsonify($response);
			}else{
				$response['status'] 	= 'error';
				$response['message']	= 'Updated Not Successfully';
				echo $this->jsonify($response);
			}
		}else{
			$response['status'] 	= 'error';
			$error['video_id'] 		= form_error('video_id');
			$error['title'] 		= form_error('title');
			$error['video_time'] 	= form_error('video_time');					
 			$response['message'] = $error;
 			echo $this->jsonify($response);

		}

	}
	public function delete(){
		$this->form_validation->set_rules('advert_id','Advert','required|trim');
		if($this->form_validation->run()){
		$data = $this->video_advertise_model->delete();
		if($data){
		   		$response['status']  = 'success';
		   		$response['message'] = 'Deleted Successfully';
		   		echo $this->jsonify($response);
		   }else{
		   		$response['status']  = 'error';
		   		$response['message'] = 'Deleted Not Successfully';
		   		echo $this->jsonify($response);
		   }
		}else{
		$response['status']         = 'error';
		$error['advert_id']			=  form_error('advert_id');
		$response['message']        = $error;
		echo $this->jsonify($response);
		}
	}


}