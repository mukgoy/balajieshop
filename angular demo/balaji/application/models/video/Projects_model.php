<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Projects_model extends CI_Model{

	public function get($select = '*', $stat_columns=false){
		$this->db->select($select);
		$this->set_search();
		$this->set_limit();
		if($stat_columns){
			$this->db->join('video_videos', 'smart_projects.project_id = video_videos.project_id', 'left');
			$this->db->join('video_video_stats as video_stats', 'video_videos.video_id = video_stats.video_id', 'left');
		}
		$query=$this->db->get('smart_projects');
		$output['data'] =$query->result_array();

		//used to filter_row_count
		$this->set_search();
		$output['total_items'] = $this->db->count_all_results('smart_projects');
		return $output;
			
	}
	public function set_search(){
		$this->db->where('smart_projects.business_id', $GLOBALS['business_id']);
		if(isset($_REQUEST['search']) && $_REQUEST['search'] != ""){
			$this->db->group_start();
				$this->db->or_like('smart_projects.title', $_REQUEST['search']);
			$this->db->group_end();
		}
	}
	public function set_limit(){
		$items_per_page = isset($_REQUEST['items_per_page']) ? $_REQUEST['items_per_page'] : 10;
		$current_page = isset($_REQUEST['current_page']) ? $_REQUEST['current_page'] : 1;
		if(isset($_REQUEST['current_page']) || isset($_REQUEST['items_per_page'])){
			$this->db->limit($items_per_page, $items_per_page * ($current_page-1));
		}
		$order_by = isset($_REQUEST['order_by']) ? $_REQUEST['order_by'] : 'modified_date';
		$order_type = isset($_REQUEST['order_type']) ? $_REQUEST['order_type'] : 'DESC';
		$this->db->order_by($order_by, $order_type);
	}
	public function add($data){
		$this->db->insert('smart_projects',$data);
		return $this->db->insert_id();
	}
	public function update($data, $where){		
		$this->db->where('business_id',$GLOBALS['business_id']);
		$this->db->where('channel_id',$where['id']);
		$query = $this->db->update('smart_projects',$data);
		return $query;
	}
	public function delete($data){		
		$this->db->where('business_id',$GLOBALS['business_id']);
		$this->db->where_in('channel_id',$data['id']);
		$this->db->delete('smart_projects');
		if($this->db->affected_rows() > 0){
			return true;
		}else{
			return false;
		}
	}

	
	
}
