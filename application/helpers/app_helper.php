<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function jsonify($data, $set_header = true){
	if($set_header){
		header('Content-Type: application/json');
	}
	if(input('draw')){
		$data['draw'] = input('draw');
	}
	if(input('callback')){
		$data['callback'] = input('callback');
	}
	if(input('redirect_url')){
		$data['redirect_url'] = input('redirect_url');
	}
	echo json_encode($data);
}

function input($key){
	if(get_instance()->input->post($key)){
		return get_instance()->input->post($key);
	}
	elseif(get_instance()->input->get($key)){
		return get_instance()->input->get($key);
	}
}

function get_field($table, $where, $field){
	$ci = get_instance();
	$ci->db->select($field);
	$ci->db->where($where);
	$query=$ci->db->get($table);
	$row = $query->row_array();
	return $row[$field];
}

function get_row($table, $where, $field){
	$ci = get_instance();
	$ci->db->select($field);
	$ci->db->where($where);
	$query=$ci->db->get($table);
	return $row = $query->row_array();
}

function get_table($table, $where, $field){
	$ci = get_instance();
	$ci->db->select($field);
	$ci->db->where($where);
	$query=$ci->db->get($table);
	return $row = $query->result_array();
}
