<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model{
	
	public function register(){
		$this->db->set('fullname', $this->input->post('name'));
		$this->db->set('email', $this->input->post('email'));
		$this->db->set('password', $this->input->post('password'));
		$this->db->set('otp_email', mt_rand(1000, 9999));
		$this->db->insert('users');
	}
	
	public function set_login_session($email, $options=[]){
		$userdata = $this->get_model->row('users','user_id,email,mobile,fullname',['email'=>$this->input->post('email')]);
		$this->session->set_userdata('userdata', $userdata);
	}
}
