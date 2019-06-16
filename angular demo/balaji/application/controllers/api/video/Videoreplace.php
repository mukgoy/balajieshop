<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Videoreplace extends Apps {
	
	public function __construct(){
		parent::__construct();
		$this->load->model('video/videos_model');
		$this->load->model('video/videoupload_model');
		$GLOBALS['business_id']	= 1;
		$GLOBALS['user_id']	= 1;
	}
	
	public function append_parts(){

		if($this->input->post('video_slug')){
			$video_slug = $this->input->post('video_slug');
		}else{
			$video_slug = $this->videoupload_model->create_video_slug();
			$_POST['video_slug'] = $video_slug;
		}
		
		$video_id = $this->db->select('video_id')->where('slug_smart', $video_slug)->get('video_videos')->row()->video_id;
		$video_folder = 'uploads/temp/'.$video_slug.'/';
		if(is_dir('./'.$video_folder)){
			$stat_rows = $this->db->select('video_id')->where('video_id', $video_id)->get('video_video_stats')->num_rows();
			if($stat_rows > 0){
				$this->load->model("video/processor/processor_model");
				$this->processor_model->delete_dir($video_folder);
				$this->db->where('video_id', $video_id);
				$this->db->delete('video_video_stats');
			}
		}
		else{
			mkdir('./'.$video_folder, 0755, true);
		}
		
		$video_ext = $this->input->post('video_ext');
		$data =  file_get_contents($_FILES['filedata']['tmp_name']);
		file_put_contents('./'.$video_folder.$video_slug.'.'.$video_ext, $data, FILE_APPEND | LOCK_EX);
		
		if(filesize($_FILES['filedata']['tmp_name']) < 1048576){
			$this->queue_insert($video_id);
		}else{
			echo json_encode(array('video_slug'=>$video_slug));
		}
	}

	public function queue_insert($video_id){
		$video_slug = $this->input->post('video_slug');
		$video_ext 	= $this->input->post('video_ext');
		$theme_id 	= 1;

		$video_folder = 'uploads/temp/'.$video_slug.'/';
		$video_url = $video_folder.$video_slug.'.'.$video_ext;
		$thumbnail = time().'.png';
		$root_thumb= $_SERVER['DOCUMENT_ROOT'].'uploads/temp/'.$video_slug.'/'.$thumbnail;

		$data = array(
			'url'			=> $video_url,
			'video_extention'=> $video_ext,
			'thumbnail'		=> $thumbnail
		);
		$where = array(
			'business_id'	=> $GLOBALS['business_id'],
			'video_id' 	=> $video_id,
		);
		$this->db->where($where);
		$this->db->update('video_videos',$data);
		$this->call_processor($video_id);
	}
	
	public function call_processor($video_id){
		$remote_url = config_item('processing_server_url').'api/video/processor/video_init?video_id='.$video_id;
		echo $response = file_get_contents($remote_url);
	}
	
}
