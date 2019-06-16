<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_frame_model extends CI_Model{

	public function get(){
		$this->db->select('frame_id,video_id');
		$query = $this->db->get('video_videos');
		return $frame = $query->result_array();
	}
	public function update(){
		$data['frame_id'] = $this->input->post('frame_id');
		$this->db->where('business_id',$GLOBALS['business_id']);
		$this->db->where('video_id',$GLOBALS['video_id']);
		$query = $this->db->update('video_videos',$data);
		return $query;
	}



}