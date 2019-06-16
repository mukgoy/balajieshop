<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Videoupload_Model extends CI_model {

	function get_channel_data($id, $select = array('*')) {
		$this->db->select(implode(",",$select));
		$this->db->where('id', $this->channel_id);
		$query=$this->db->get('channels');
		return $query->row();
	}	
	public function create_new_project($project_info){
		$this->db->insert('projects',$project_info);
		return $this->db->insert_id();
	}
	public function video_create($video_info, $stats){
		$this->db->insert('videos',$video_info);
		$video_id = $this->db->insert_id();
		if($video_id){
			$video_stats = array(
								'video_id'		=> $video_id,
								'file_size'		=> $stats['file_size'],
								'video_lenght'	=> $stats['video_lenght']
								);
			$this->db->insert('video_stats',$video_stats);
			
			$video_seo = array(
								'video_id'		=> $video_id,
								'title'			=> $video_info['title'],
								'description'	=> $video_info['description'],
								);
			$this->db->insert('videos_seo',$video_seo);
			
		}
		return $video_id;
	}
	function add_ffmpeg_queue($ffmpeg_queue){
		$this->db->insert('ffmpeg_queue',$ffmpeg_queue);
	}
	function create_video_slug() {
		$tokens = 'abcdefghijklmnopqrstuvwxyz123456789';
		$segment_chars = 10;
		$slug = '';
		$segment = '';
		for ($j = 0; $j < $segment_chars; $j++) {
			$segment .= $tokens[rand(0, strlen($tokens)-1)];
		}
		$slug .= $segment;
		return $slug;
	}
	function update_video_stats($video_id, $video_stats) {
		foreach($video_stats as $key=>$val){
			$stats[] = array(
			'video_id'=>$video_id,
			'meta_key'=>$key,
			'meta_value'=>$val,
			);
		}
		$this->db->insert_batch('vw_video_meta', $stats);
	}
}
