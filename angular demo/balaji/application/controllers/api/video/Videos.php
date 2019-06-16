<?php

defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Videos extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/videos_model');		
	}
	
	public function index(){
		$response = $this->videos_model->get();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	} 

	public function get_process_status(){
		$result = $this->db->select('status,folder')->where('video_id', $_GET['video_id'])->get('video_ffmpeg_queue')->row_array();
		$this->load->model("video/processor/processor_model");
		$status_file = './'.$result['folder'].'status_process1.txt';
		$process_status = $this->processor_model->process_status($status_file);	
		$response['status'] = $result['status'] == 'move_s3_done' ? 'complete' : 'processing';
		$response['process_percent'] = $process_status;
		$response['video_id'] = $_GET['video_id'];
		echo $this->jsonify($response);
	}
	

	
}
