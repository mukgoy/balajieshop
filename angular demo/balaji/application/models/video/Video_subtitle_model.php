<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_subtitle_model extends CI_Model{

	public function get(){
		$this->db->select('subtitles,video_id');
		$this->db->where('video_id',$GLOBALS['video_id']);
		$query = $this->db->get('video_video_details');
		return $query->row_array();
	}
	public function update(){
		$data['subtitles'] = $this->input->post('subtitles');
		$this->db->where('video_id',$GLOBALS['video_id']);
		$query = $this->db->update('video_video_details',$data);
		if($this->db->affected_rows() == 0){
			if(!$this->get()){
				$data['video_id'] = $GLOBALS['video_id'];
				$query = $this->db->insert('video_video_details',$data);
			}
		}
		return 1;
	}
}
