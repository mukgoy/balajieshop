<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class User extends Apps {

	public function __construct(){
		parent::__construct();
		$this->load->model("common/get_model");
		$this->load->model('frontend/user_model');
		$this->load->helper('app');
	}
	
	public function register(){
		$this->form_validation->set_rules('name','Name','required|trim');
		// $this->form_validation->set_rules('email','Email','required|trim|is_unique[users.email]', array('is_unique' => 'This %s is already registered.'));
		$this->form_validation->set_rules('password','Password','required|trim');
		$this->form_validation->set_rules('cpassword','Confirm Password','required|trim');
		if($this->form_validation->run()){
			if($this->input->post('password') != $this->input->post('cpassword')){
				$error['cpassword'] = "Confirm Password not same."; 
			}
			if(!empty($error)){
				$response['status'] = 'error';
				$response['message'] = $error;
				echo jsonify($response);
				die;
			}
			$data = $this->user_model->register();
			$response['status']= 'success';
			$response['message']= 'Register Success. Please verify details.';
			echo jsonify($response);
		}else{
			$response['status'] = 'error';
			$error['name'] = form_error('name','',''); 
			$error['email'] 	= form_error('email'); 
			$error['password'] 	= form_error('password'); 
			$error['cpassword'] = form_error('cpassword'); 
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	public function login(){
		$this->form_validation->set_rules('email','email','required|trim');
		$this->form_validation->set_rules('password','password','required|trim');
		if($this->form_validation->run()){
			$password = $this->get_model->field('users','password',['email'=>$this->input->post('email')]);
			if($password == $this->input->post('password')){
				$this->user_model->set_login_session($this->input->post('email'));
				$response['status']= 'success';
				$response['message']= 'Login success.';
			}else{
				$response['status'] = 'error';
				$response['message'] = "Please provide valid details.";
			}
			echo jsonify($response);
		}else{
			$response['status'] = 'error';
			$error['password'] = form_error('password'); 
			$error['email'] 	= form_error('email');
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	public function resend_otp_email(){
		$this->form_validation->set_rules('email','Email','required|trim');
		if($this->form_validation->run()){
			$otp_email = $this->get_model->field('users','otp_email',['email'=>$this->input->post('email')]);
			if($otp_email){
				$response['otp']= $otp_email;
				$response['status']= 'success';
				$response['message']= 'OTP resend Success. Please verify details.';
			}else{
				$response['status'] = 'error';
				$response['message'] = "Please provide valid details.";
			}
			echo jsonify($response);
		}else{
			$response['status'] = 'error';
			$error['email'] 	= form_error('email');
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	public function verify_otp_email(){
		$this->form_validation->set_rules('email','Email','required|trim');
		$this->form_validation->set_rules('otp_email','OTP','required|trim');
		if($this->form_validation->run()){
			$otp_email = $this->get_model->field('users','otp_email',['email'=>$this->input->post('email')]);
			if($otp_email == $this->input->post('otp_email')){
				$response['status']= 'success';
				$response['message']= 'Email verify success.';
			}else{
				$response['status'] = 'error';
				$response['message'] = "Please provide valid details.";
			}
			echo jsonify($response);
		}else{
			$response['status'] = 'error';
			$error['otp_email'] = form_error('otp_email'); 
			$error['email'] 	= form_error('email'); 
 			$response['message'] = $error;
 			echo jsonify($response);
		}
	}
	
	public function get_userdata(){
		$data = $this->session->userdata('userdata');
		if($data)
		echo jsonify($data);
	}
	
}
