<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Videos_model extends CI_Model{

	public function get($select = '*', $stat_columns=false){
		$this->db->select($select);
		$this->set_search();
		$this->set_limit();
		if($stat_columns){
			$this->db->join('video_video_stats as video_stats', 'video_videos.video_id = video_stats.video_id', 'left');
		}
		$query=$this->db->get('video_videos');
		$output['data'] =$query->result_array();
		
		//used to filter_row_count
		$this->set_search();
		$query=$this->db->get('video_videos');
		$output['total_items'] =$query->num_rows();

		return $output;
			
	}
	public function set_search(){
		$this->db->where('video_videos.business_id', $GLOBALS['business_id']);
		if(isset($_REQUEST['search']) && $_REQUEST['search'] != ""){
			$this->db->group_start();
				$this->db->or_like('video_videos.title', $_REQUEST['search']);
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
	
	
}
