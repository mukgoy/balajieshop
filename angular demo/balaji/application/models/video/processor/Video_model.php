<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_Model extends CI_model {
	
	function get_video($video_id, $select = array('*')){
		$this->db->select($select);
		$this->db->where('video_id', $video_id);
		$query=$this->db->get('video_videos');
		return $query->row_array();
	}
	
	function update_video_stats($video_id, $video_stats) {
		$this->db->where('video_id', $video_id);
		$this->db->delete('video_video_stats');
		
		$this->db->set('video_id', $video_id);
		$this->db->set('width', $video_stats['width']);
		$this->db->set('height', $video_stats['height']);
		$this->db->set('duration', $video_stats['duration']);
		$this->db->set('file_size ', $video_stats['size']);
		$this->db->insert('video_video_stats');
	}
	
	function set_video_url($queue){
		$video_url = 'uploads/businesses/'.$queue['business_id'].'/video/videos/'.$queue['video_slug'].'/mpd.mpd';
		$this->db->set('url', $video_url);
		$this->db->where('video_id', $queue['video_id']);
		$this->db->update('video_videos');
	}
	
	
}
