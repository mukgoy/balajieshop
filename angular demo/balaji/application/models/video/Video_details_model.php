<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_details_model extends CI_Model{

	public function get(){
		$this->get_videos_data();
		$this->get_video_details_data();				
		$this->db->join('video_videos','video_video_details.video_id = video_videos.video_id','left');
		$query = $this->db->get('video_video_details');
		$output = $query->row_array();
		$output1 = $this->get_video_tags();		
		return $data = array_merge($output,$output1);
	}
	public function get_videos_data(){
		$this->db->where('video_videos.business_id',$GLOBALS['business_id']);
		$this->db->select('title,status');
	}
	public function get_video_details_data(){
		$this->db->select('description,password');		
 	}
 	public function get_video_tags(){
 		$this->db->select('tag_id');
 		$query = $this->db->get('video_video_tags');
 		return $query->result_array();
 	}
	public function update(){
		 $this->update_videos_data();
		 $this->update_video_details_data();
		 return true;
	}
	public function update_videos_data(){
		$data['title']	= $this->input->post('title');
		$data['status']	= $this->input->post('status');		   					
		$this->db->where('business_id',$GLOBALS['business_id']);
		$this->db->where('video_id',$this->input->post('video_id'));
		$query = $this->db->update('video_videos',$data);				
		return $query;
	}
	public function update_video_details_data(){
		$data['description'] = $this->input->post('description');
		$data['password']    = $this->input->post('password');				
		$this->db->where('video_id',$this->input->post('video_id'));
		$query = $this->db->update('video_video_details',$data);
		return $query;
	}
	/**
	public function delete(){
		$this->delete_videos_data();
		return $this->delete_video_details_data();
	}	
	public function delete_videos_data(){
		$id = $this->input->post('video_id');
	   	$data['id'] = $id;
	   	$data['id'] = explode(',', $data['id']);	   
		$this->db->where_in('video_id',$data['id']);
		$this->db->delete('video_videos');
			if($this->db->affected_rows() > 0){				
				return true;
			}else{						
				return false;
			}
		}
		
	public function delete_video_details_data(){
		$id = $this->input->post('video_id');
	   	$data['id'] = $id;
	   	$data['id'] = explode(',', $data['id']);
	  	$this->db->where_in('video_id',$data['id']);
		$this->db->delete('video_video_details');
			if($this->db->affected_rows() > 0){
				return true;
			}else{
				return false;
			}
		}
		**/
	}
	
	

	
	

