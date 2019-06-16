<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_players_model extends CI_Model{

	public function get(){
		$defaults   =	$this->get_player_themes_default_data();
		$custom		= 	$this->get_player_themes_data();
		$themes  	= array_merge($defaults,$custom);
		return $themes;		
	}
	public function get_player_themes_default_data(){
		$this->db->select('*');
		$query 		= $this->db->get('video_player_themes_default');
		return  $query->result_array();
	}
	public function get_player_themes_data(){
		$this->db->select('*');
		$this->db->where('business_id', $GLOBALS['business_id']);
		$query 		= $this->db->get('video_player_themes');
		return $query->result_array();
	}
	
	public function add(){
		$data = $this->create_theme_data();
		$data['business_id']        = $GLOBALS['business_id'];
		$data['created_by']         = $GLOBALS['user_id'];
		$data['created_date']       = time();
		$this->db->insert('video_player_themes',$data);
		return $this->db->insert_id();
	}
	public function update(){
		$data = $this->create_theme_data();
		$this->db->where('business_id',$GLOBALS['business_id']);
		$this->db->where('player_theme_id',$this->input->post('player_theme_id'));
		$query = $this->db->update('video_player_themes',$data);
		return $query;		
	}
	public function create_theme_data(){	
		$data['playerskin'] 		= $this->input->post('playerskin');
		$data['title'] 				= $this->input->post('title');
		$data['themecolor'] 		= $this->input->post('themecolor');
		$data['textcolor'] 			= $this->input->post('textcolor');
		$data['elementsallowed']	= $this->input->post('elementsallowed');
		$data['startaction'] 		= $this->input->post('startaction');
		$data['endaction'] 			= $this->input->post('endaction');
		$data['logo'] 				= $this->input->post('logo');
		$data['logolink'] 			= $this->input->post('logolink');
		$data['thumbnail'] 			= $this->input->post('thumbnail');
		$data['modified_by']        = $GLOBALS['user_id'];
		$data['modified_date']      = time();
		return $data;
	}
	
	public function delete(){		
		$id = $this->input->post('player_theme_id');
	   	$data['id'] = $id;
	   	$data['id'] = explode(',', $data['id']);	   
		$this->db->where_in('player_theme_id',$data['id']);
		$this->db->delete('video_player_themes');
			if($this->db->affected_rows() > 0){				
				return true;
			}else{						
				return false;
			}
	}
	

}