<?php

defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Video_thumbnail extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/video_thumbnail_model');			
	}
	
	public function index(){
		$response = $this->video_thumbnail_model->get();		
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	public function upload(){
		$this->load->helper('smart/upload_helper');			
		$config['upload_path']   = 'uploads/temp/'; 
        $config['allowed_types'] = 'png|jpg|gif|jpeg';
		$ext = pathinfo($_FILES['thumbnail']['name'], PATHINFO_EXTENSION);
    	$config['file_name'] =time().'.'.$ext;
		$this->load->library('upload', $config);			
		if($this->upload->do_upload('thumbnail')){
		$file_data= $this->upload->data();
		$source_file = $file_data['full_path'];
		$slug_smart = $this->video_thumbnail_model->get_slug_smart();
		$slug_smart = $slug_smart['slug_smart'];						
		$destination_file = "uploads/businesses/".$GLOBALS['business_id']."/video/videos/".$slug_smart."/".$file_data['file_name'];			
			$res = upload_file($source_file, $destination_file);
			if($res == true){
				$upload = $config['file_name'];
				$this->video_thumbnail_model->update_thumbnail($upload);
			}
		}
		else{
		$this->upload->display_errors();
		}
	}
}
	