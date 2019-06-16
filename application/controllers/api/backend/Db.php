<?php
//echo $this->db->last_query();
defined('BASEPATH') OR exit('No direct script access allowed');

class Db extends CI_Controller {
	
	public function category(){
		$data = [];
		$this->db->select("cat3");
		$this->db->group_by('cat3');
		$qry3 = $this->db->get('product_list');
		$cats3 = array_column($qry3->result_array(), 'cat3');
		
		foreach($cats3 as $cat3){
			$this->db->select("cat2");
			$this->db->where("cat3", $cat3);
			$this->db->group_by('cat2');
			$qry2 = $this->db->get('product_list');
			$cats2 = array_column($qry2->result_array(), 'cat2');
			
			foreach($cats2 as $cat2){
				$this->db->select("cat1");
				$this->db->where("cat2", $cat2);
				$this->db->group_by('cat1');
				$qry1 = $this->db->get('product_list');
				$data[$cat3][$cat2] = array_column($qry1->result_array(), 'cat1');
			} 
		} 
		
		foreach($data as $cat1=>$cats2){
			$this->db->set("title", $cat1);
			$this->db->insert('categories1');
			$cat1_id = $this->db->insert_id();
			foreach($cats2 as $cat2=>$cats3){
				$this->db->set("title", $cat2);
				$this->db->set("cat1_id", $cat1_id);
				$this->db->insert('categories2');
				$cat2_id = $this->db->insert_id();
				foreach($cats3 as $cat3){
					$this->db->set("title", $cat3);
					$this->db->set("cat2_id", $cat2_id);
					$this->db->insert('categories3');
					$cat3_id = $this->db->insert_id();
				}
			}
		}
		
	}
	
	public function brands(){
		$data = [];
		$this->db->select("Brand");
		$this->db->group_by('Brand');
		$qry3 = $this->db->get('product_list');
		$Brands = array_column($qry3->result_array(), 'Brand');
			
		foreach($Brands as $Brand){
			$this->db->set("title", $Brand);
			$this->db->insert('brands');
		}
		
	}
}



