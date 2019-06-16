<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Get_model extends CI_Model{

	function field($table, $field, $where){
		$this->db->select($field);
		$this->db->where($where);
		$query=$this->db->get($table);
		$res = $query->row_array();
		if(!empty($res[$field])){
			return $res[$field];
		}
	}
	
	function row($table, $fields, $where){
		$this->db->select($fields);
		$this->db->where($where);
		$query=$this->db->get($table);
		return $query->row_array();
	}
	
	function table($table, $fields, $where){
		$this->db->select($fields);
		$this->db->where($where);
		$query=$this->db->get($table);
		return $query->result_array();
	}
	
	
}
