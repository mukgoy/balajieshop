<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Categories extends CI_Controller {
	
	public function categories1(){
		$this->db->select("cat1_id,title");
		$query = $this->db->get('categories1');
		echo json_encode($query->result());
	}
	
	public function categories2($cat1_id){
		$this->db->select("cat2_id,title");
		$this->db->where("cat1_id",$cat1_id);
		$query = $this->db->get('categories2');
		echo json_encode($query->result());
	}
	
	public function categories3($cat2_id){
		$this->db->select("cat2_id,title");
		$this->db->where("cat2_id",$cat2_id);
		$query = $this->db->get('categories3');
		echo json_encode($query->result());
	}
	
}
