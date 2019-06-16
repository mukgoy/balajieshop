<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Video_players extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/video_players_model');		
	}
	public function index(){
		$response = $this->video_players_model->get();
		$response['status'] = 'success';
		echo $this->jsonify($response);

	}
	public function add(){
		$this->form_validation->set_rules('title','Title','required|trim');
		$this->form_validation->set_rules('business_id','business_id','required|trim');
		if($this->form_validation->run()){
			$data = $this->video_players_model->add();
			if($data){
				$response['status']= 'success';
				$response['message']= 'Added';
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
		$this->form_validation->set_rules('business_id','business_id','required|trim');
		if($this->form_validation->run()){			
			$data 					= $this->video_players_model->update();
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
	       $this->form_validation->set_rules('player_theme_id','Player','required');
	       if($this->form_validation->run()){		   
		   $data = $this->video_players_model->delete();
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
			$response['status']  		=	'error';
			$error['player_theme_id']	=	form_error('player_theme_id');
			$response['message']		=	$error;
			echo $this->jsonify($response);
		 
	}
		}
	
		

	

} 