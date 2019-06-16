<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Getlist extends CI_Controller {

	function categories1(){
		$this->db->select('*');
		$query=$this->db->get('categories1');
		echo jsonify($query->result());
	}
	function categories2(){
		$this->db->select('*');
		$query=$this->db->get('categories2');
		echo jsonify($query->result());
	}
	function categories3(){
		$this->db->select('*');
		$query=$this->db->get('categories3');
		echo jsonify($query->result());
	}
	function areas(){
		$this->db->select('*');
		$query=$this->db->get('areas');
		echo jsonify($query->result());
	}
	function brands(){
		$this->db->select('*');
		$query=$this->db->get('brands');
		echo jsonify($query->result());
	}
}
