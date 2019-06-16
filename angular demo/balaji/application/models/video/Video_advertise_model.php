<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_advertise_model extends CI_Model{

	public function get(){
		$where['video_id'] = $this->input->post('video_id');
		$this->db->where('video_id',$where['video_id']);
		$this->db->select('*');
		$query = $this->db->get('video_adverts');
		return  $query->result_array();

	}

	public function add(){
		
			$data['video_id'] 	= 	$GLOBALS['video_id'];
			$data['title']    	= 	$this->input->post('title');
			$data['video_time']	= 	$this->input->post('video_time');
			$data['type']		= 	$this->input->post('type');			
			$data['skip_time']	=	$this->input->post('skip_time');
			if($this->input->post('type') == 'image'){					
				 $arr =  array("image_url"=> $this->input->post('image_url'),"link_url"=> $this->input->post('link_url'));				
				$data['other_json'] = json_encode($arr);
			}
			if($this->input->post('type') ==  'text'){				
				$arr =  array("text_color" => $this->input->post('text_color'),"background_color"=> $this->input->post('background_color'), "text_title" => $this->input->post('text_title'), "text_description" => $this->input->post('text_description'), "link_url" => $this->input->post('link_url'));
				$data['other_json'] = json_encode($arr);
			}
			if($this->input->post('type') == 'html'){
				$arr = array("html_url" => $this->input->post('html_url'));
				$data['other_json'] = json_encode($arr);
			}			
			$data['segment_id']	=	$this->input->post('segment_id');
			$this->db->insert('video_adverts',$data);
			return $this->db->insert_id();
	}
	public function update(){
		$where['advert_id'] = $this->input->post('advert_id');
		$data['title']      = $this->input->post('title');
		$data['video_time']	= $this->input->post('video_time');
		$data['segment_id']	= $this->input->post('segment_id');
		$this->db->where('advert_id',$where['advert_id']);
		$query = $this->db->update('video_adverts',$data);
		return $query;
	}
	public function delete(){
		$data['id'] = $this->input->post('advert_id');
		$data['id'] = explode(',',$data['id']);
		$this->db->where_in('advert_id',$data['id']);
		$this->db->delete('video_adverts');
		if($this->db->affected_rows() > 0){
			return true;
		}else{
			return false;
		}

	}
}

