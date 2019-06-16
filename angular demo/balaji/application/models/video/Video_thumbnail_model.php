<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_thumbnail_model extends CI_Model{

	public function get(){
		$video_id = $this->input->post('video_id');
		$this->db->select('thumbnail,slug_smart');
		$this->db->where('video_id',$video_id);
		$query = $this->db->get('video_videos');
		$query = $query->row_array();
		$slug_smart = $query['slug_smart'];
		$thumbnail  = $query['thumbnail'];
		$destination_file = "uploads/businesses/".$GLOBALS['business_id']."/video/videos/".$slug_smart."/".$thumbnail;
		$destination_file = array($destination_file);
		return $destination_file;

	}
	public function get_slug_smart(){
		$video_id = $this->input->post('video_id');
		$this->db->select('slug_smart');
		$this->db->where('video_id',$video_id);
		$query = $this->db->get('video_videos');
 		return $query->row_array();
	}
	public function update_thumbnail($upload){
		$video_id = $this->input->post('video_id');		      	
      	$this->db->where('video_id',$video_id);
      	 return $query = $this->db->update('video_videos',['thumbnail'=>$upload]); 	
      	
	}
}