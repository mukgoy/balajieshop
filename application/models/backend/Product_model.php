<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_model extends CI_model {

	function get(){
		$this->db->select('*');
		$this->set_filter();
		$this->set_limit();
		$query=$this->db->get('products');
		$output['data'] =$query->result();
		
		//used to filter_row_count
		$this->db->select('count(product_id) as nums');
		$this->set_filter();
		$query=$this->db->get('products');
		$output['total_items'] = $query->row()->nums;
		return $output;
	}

	function set_filter(){
		if($this->input->get('cat3_id')){
			$this->db->where('cat3_id', $this->input->get('cat3_id'));
		}
		elseif($this->input->get('cat2_id')){
			$this->db->where('cat2_id', $this->input->get('cat2_id'));
		}
		elseif($this->input->get('cat1_id')){
			$this->db->where('cat1_id', $this->input->get('cat1_id'));
		}
		if($this->input->get('brand_ids')){
			$this->db->where_in('brand_id', explode(',',$this->input->get('brand_ids')));
		}
		if($this->input->get('search')){
			$this->db->group_start();
			$this->db->or_like('id', $this->input->get('search'));
			$this->db->or_like('title', $this->input->get('search'));
			$this->db->group_end();
		}
	}
	
	function set_limit(){
		$item_per_page = $this->input->get('item_per_page')?$this->input->get('item_per_page'):10;
		$current_page = $this->input->get('current_page')?$this->input->get('current_page'):1;
		$this->db->limit($item_per_page, ($current_page-1)*$item_per_page);
		
		$order_by = $this->input->get('order_by')?$this->input->get('order_by'):'modified';
		$order = $this->input->get('order')?$this->input->get('order'):'desc';
		$this->db->order_by($order_by, $order);
	}
	
	
	public function get_launcher($id){
		$this->db->select('*');
		$this->db->where('id', $id);
		$this->db->where('user_id', $this->getSessionUser('id'));
		$query=$this->db->get('launchers');
		return $query->row();
	}
	
	public function get_launcher_saved_groups($select = array('*')){
		$this->db->select(implode(",",$select));
		$this->db->where('user_id', $this->getSessionUser('id'));
		if($_GET['search']['value'] != ""){
			$this->db->group_start();
				$this->db->or_like('id', $_GET['search']['value']);
				$this->db->or_like('title', $_GET['search']['value']);
				$this->db->or_like('group_id', $_GET['search']['value']);
			$this->db->group_end();
		}
		$this->set_limit();
		$this->db->where('launcher_id', $_GET['launcher_id']);
		$query=$this->db->get('launcher_groups');
		$output['data'] =$query->result();
		
		
		//used to filter_row_count
		$this->db->select('id');
		$this->db->where('user_id', $this->getSessionUser('id'));
		if($_GET['search']['value'] != ""){
			$this->db->group_start();
				$this->db->or_like('id', $_GET['search']['value']);
				$this->db->or_like('title', $_GET['search']['value']);
				$this->db->or_like('group_id', $_GET['search']['value']);
			$this->db->group_end();
		}
		$query=$this->db->get('launcher_groups');
		$output['filter_row_count'] =$query->num_rows();
		
		//used to total_row_count
		$this->db->select('id');
		$this->db->where('user_id', $this->getSessionUser('id'));
		$query=$this->db->get('launcher_groups');
		$output['total_row_count'] =$query->num_rows();
		return $output;
	}
	
	
	private function getSessionUser($field){
		if($this->session->userdata('logged_in')){ 
			$userdata = $this->session->userdata('logged_in');
			return $userdata[$field];
		}
	}

	public function multi_launcher_delete(){
		$this->db->where_in('id',$_POST['data_row_ids']);
		$this->db->where('user_id', $this->getSessionUser('id'));
		$this->db->delete('launchers');
		
		$this->db->where_in('launcher_id',$_POST['data_row_ids']);
		$this->db->where('user_id', $this->getSessionUser('id'));
		$this->db->delete('launcher_groups');
	}
	
	public function totalFacebookCampaignsCount(){
		$this->db->select('count(id) as total');
		$this->db->where('user_id', $this->getSessionUser('id'));
		$query=$this->db->get('launchers');
		return $query->row()->total;
	}
	public function totalSavedGroupCount(){
		$this->db->select('count(id) as total');
		$this->db->where('user_id', $this->getSessionUser('id'));
		$query=$this->db->get('launcher_groups');
		return $query->row()->total;
	}
}
