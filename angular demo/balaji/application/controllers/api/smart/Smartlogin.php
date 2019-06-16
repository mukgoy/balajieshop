<?php
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . 'libraries/REST_Controller.php';

class Smartlogin extends CI_Controller {
	function __construct()
		{
			// Construct the parent class
			parent::__construct();
			$this->load->model(SMART_FOLDER.SMART_LOGIN_FOLDER.'Smartlogin_model');	
			$this->load->model(SMART_FOLDER.'Mail_model');	
			$this->config->load('smart_tables');
			$this->load->helper("sag_common_helper");
		}
	/*****
	* function smart_login_request: It check login request from login form 
	* .	
	****/
	public function smart_login_request()
	{
		if($this->input->post('save')){
			
			$this->form_validation->set_rules('email_address','Email Address','required|trim|callback_check_email_exists');
			$this->form_validation->set_rules('password','Password','required|trim');
			//$this->form_validation->set_rules('g-recaptcha-response','Captcha','required');
			if($this->form_validation->run()){	
				$this->Smartlogin_model->login_user();
			}
			else{
				$data['error'] = 1;
				$data['email_error'] = strip_tags(form_error('email_address'));
				$data['password_error'] = strip_tags(form_error('password'));
				$data['capctha_error'] = strip_tags(form_error('g-recaptcha-response'));
				echo json_encode($data);
				die;
			}
		}
	}
	
	public function smart_sub_login_request(){
		if($this->input->post('save')){
			$this->form_validation->set_rules('email_address','Email Address','required|trim|callback_check_email_exists');
			$this->form_validation->set_rules('password','Password','required|trim');
			if($this->form_validation->run()){	
			$this->Smartlogin_model->login_user_subdomain();
			}
			else{
				$data['error'] = 1;
				$data['email_error'] = strip_tags(form_error('email_address'));
				$data['password_error'] = strip_tags(form_error('password'));
				echo json_encode($data);
				die;
			}
		}
	}
	
	public function check_email_exists(){
		
		if($this->input->post('email_address') == ''){
			$this->form_validation->set_message('check_email_exists', 'Email address is required!');
			return FALSE;
		}
		
		$table = $this->config->item('saglus_users');
		$check_array = array('email'=>$this->input->post('email_address'));
		$get_array = array('user_id');
		$response = checkValueExist($table,$check_array,$get_array);
		if($response > 0){
			return TRUE;
		}
		$this->form_validation->set_message('check_email_exists', 'User Not Exist');
		return FALSE;
	}
	public function check_login_status(){
		if($this->session->userdata('sagsmart_login_data')){
			$user_id = $this->session->userdata('sagsmart_login_data')['user_id'];
			$return  = $this->Smartlogin_model->getUserBusinesses($user_id);
			$return_array["status"] = 1;
			$return_array["redirect_url"] = $return['redirect_url'];
			if($return['auth'])
			$return_array['auth'] = $return['auth'];
			echo json_encode($return_array);
			die;			
		}
		else{
			echo json_encode(array("status"=>0));
			die;			
		}
		echo "<pre>";
		print_r();
		die;
	}
	public function check_login_subdomain_status(){
		if($this->session->userdata('sagsmart_login_data')){
			$user_id = $this->session->userdata('sagsmart_login_data')['user_id'];
			$response = get_current_subdomain(current_url());
			$resp = $this->Smartlogin_model->get_user_all_subdomain($user_id);
			
			$response_array['status'] = 1;
			if($resp){
				if(!in_array($response,$resp)){
					$response_array['auth'] = 0;
					$response_array['redirect_url'] = '/dashboard';
				}
				else{
					$response_array['auth'] = 1;
					$response_array['redirect_url'] = '/dashboard';
				}
					
			}
			else{
				$response_array['redirect_url'] = '/business-step1';
			}
		}
		else{
			$response_array['status'] = 0;
					
		}
		echo json_encode($response_array);
		die;	
	}
	
	
	function get_login_details(){
		if($this->session->userdata('sagsmart_login_data')){
			$session = $this->session->userdata('sagsmart_login_data');
			
			$data['success'] = 1;
			$data['status'] = 1;
			$data['email'] = $session['email'];
			$data['user_id'] = $session['user_id'];
			$data['first_name'] = $session['first_name'];
			$data['last_name'] = $session['last_name'];
			$data['mobile'] = $session['mobile'];
			$data['business_id'] = $this->session->userdata('signup_business_id');
			echo json_encode($data);
			die;			
		}
		else{
			echo json_encode(array("status"=>0));
			die;			
		}
	}
	public function recaptcha($str='')
	{
		$google_url="https://www.google.com/recaptcha/api/siteverify";
		//local
		//$secret='6Lfy1CkUAAAAAHdy-nR5E7Keb5cpLGRqWA7dgAiy';
		
		//live
		$secret='6Lfy1CkUAAAAACfLVjhuBN_vog7-yhfOS_smWuvH';
		
		$ip=$_SERVER['REMOTE_ADDR'];
		$url=$google_url."?secret=".$secret."&response=".$str."&remoteip=".$ip;
        //print_r($url); die;
		$curl = curl_init();
		curl_setopt($curl, CURLOPT_URL, $url);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($curl, CURLOPT_TIMEOUT, 10);
		curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
		curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; rv:1.9.2.16) Gecko/20110319 Firefox/3.6.16");
		$res = curl_exec($curl);
		curl_close($curl);
		$res= json_decode($res, true);
    //reCaptcha success check
		if($res['success']=='true')
		{
			return TRUE;
		}
		else
		{
			$this->form_validation->set_message('recaptcha', 'The reCAPTCHA field is telling me that you are a robot. Shall we give it another try?');
			return FALSE;
		}
	}
	
	
	
	function logout_user(){
		$this->session->sess_destroy();
		echo json_encode(array('error'=>0,'success'=>1));
		die;
	}
	
	
	function forgot_password_request(){
		if($this->input->post('save')){
			$this->form_validation->set_rules('email_address','Email Address','required|trim|callback_check_email_exists');
			if($this->form_validation->run()){	
				$this->Smartlogin_model->forgot_password_request();
			}
			else{
				$data['error'] = 1;
				$data['email_error'] = strip_tags(form_error('email_address'));
				echo json_encode($data);
				die;
			}
		}
	}
	function reset_password_request(){
		
		if($this->input->post('save')){
			$this->form_validation->set_rules('password','Password ','required|trim');
			if($this->form_validation->run()){	
				$code = $this->input->post("code");
				$email = $this->input->post("email");
				$response = $this->Smartlogin_model->update_user_password($code,$email);
				//$this->Smartlogin_model->forgot_password_request();
			}
			else{
				$data['error'] = 1;
				$data['password_error'] = strip_tags(form_error('password'));
				echo json_encode($data);
				die;
			}
		}
	}
	
	function smart_subdomain_login_request(){
		if($this->input->post('save')){
			$this->form_validation->set_rules('email_address','Email Address','required|trim|callback_check_email_exists');
			$this->form_validation->set_rules('password','Password','required|trim');
			//$this->form_validation->set_rules('g-recaptcha-response','Captcha','required');
			if($this->form_validation->run()){	
				$this->Smartlogin_model->login_user();
			}
			else{
				$data['error'] = 1;
				$data['email_error'] = strip_tags(form_error('email_address'));
				$data['password_error'] = strip_tags(form_error('password'));
				$data['capctha_error'] = strip_tags(form_error('g-recaptcha-response'));
				echo json_encode($data);
				die;
			}
		}
	}
	
	function get_user_status(){
		$session_name = "sagsmart_login_data";
		$sess_array = get_session($session_name);
		$response = get_current_subdomain(current_url());
		if($sess_array){
			if($response){
				$data['error'] = 0;
				$data['user_status'] = $sess_array['status'];
			}
		}
		else{
			$data['error'] = 1;
			$data['login_status'] = 0;
		}
		if($response){
			$data['subdomain'] = $response;
		}
		echo json_encode($data);
		die;
	}
	function resend_activation_request(){
		$session_name = "sagsmart_login_data";
		$sess_array = get_session($session_name);
		$response = $this->Smartlogin_model->resend_activation_link($sess_array);	
		echo "<pre>";
		print_r($sess_array);
		die;
		
	}
	function check_user_domain_authentication(){
		if($this->session->userdata('sagsmart_login_data')){
			$user_id = $this->session->userdata('sagsmart_login_data')['user_id'];
			$response = get_current_subdomain(current_url());
			if(!$response){
				$response_array['auth'] = 1;
			}
			else{
				$resp = $this->Smartlogin_model->get_user_all_subdomain($user_id);
			
				$response_array['status'] = 1;
				if($resp){
					if(!in_array($response,$resp)){
						$response_array['auth'] = 0;
						$response_array['redirect_url'] = '/dashboard';
					}
					else{
						$response_array['auth'] = 1;
					}
						
				}
				else{
					$response_array['redirect_url'] = '/business-step1';
				}
			}	
		}
		else{
			$response_array['status'] = 0;
					
		}
		echo json_encode($response_array);
		die;	
	}

}
