<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Smartsignup extends CI_Controller {
	function __construct()
		{
			// Construct the parent class
			parent::__construct();
			$this->config->load('smart_tables');
			$this->load->model(SMART_FOLDER.SMART_SIGNUP_FOLDER.'Smartsignup_model');
			$this->load->model(SMART_FOLDER.'Mail_model');	
			$this->smart_businesses = $this->config->item('smart_businesses');	
		}
	/*****
	* function signup_step1_action: It check signup request from signup form 
	* How It Works: first it checks record allready exist or not exist with same email,then insert data into user table.	
	****/
	public function smart_signup_request()
	{
		if($this->input->post('save')){
			$this->form_validation->set_rules('company_name','Company Name','required|trim');
			$this->form_validation->set_rules('company_role','Company Role','required|trim');
			$this->form_validation->set_rules('company_size','Company Size','required|trim');
			$this->form_validation->set_rules('email_address','Email Address','required|trim|callback_check_email_exists');
			$this->form_validation->set_rules('full_name','Full Name','required|trim');
			$this->form_validation->set_rules('mobile_number','Mobile Number','required|trim');
			if($this->form_validation->run()){
				
				// generate session temporary and send a otp on mail or phone number
				$this->Smartsignup_model->add_user_step1();
				//save details
			}
			else{
				$data['error'] = 1;
				$data['email_error'] = strip_tags(form_error('email_address'));
				$data['company_name_error'] = strip_tags(form_error('company_name'));
				$data['company_role_error'] = strip_tags(form_error('company_role'));
				$data['company_size_error'] = strip_tags(form_error('company_size'));
				$data['full_name_error'] = strip_tags(form_error('full_name'));
				$data['mobile_number_error'] = strip_tags(form_error('mobile_number'));
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
		$this->load->helper("sag_common_helper");
		$table = $this->config->item('saglus_users');
		$check_array = array('email'=>$this->input->post('email_address'));
		$get_array = array('user_id');
		$response = checkValueExist($table,$check_array,$get_array);
		if($response >= 1){
			$this->form_validation->set_message('check_email_exists', 'User Already Exist!');
			return FALSE;
		}
		return TRUE;
	}
	
	
	public function company_size(){
		$this->load->helper("sag_common_helper");
		$table = $this->config->item('smart_company_size_master');
		$check_array = array('status'=>'1');
		$get_array = array('id','title');
		$this->load->helper("sag_common_helper");
		$returnArray = array();
		$returnArray = getMultipleRows($table,$check_array,$get_array);
		echo json_encode($returnArray);
		die;
	}
	public function company_role(){
		$this->load->helper("sag_common_helper");
		$table = $this->config->item('smart_company_role_master');
		$check_array = array('status'=>'1');
		$get_array = array('id','title');
		$this->load->helper("sag_common_helper");
		$returnArray = array();
		$returnArray = getMultipleRows($table,$check_array,$get_array);
		echo json_encode($returnArray);
		die;
	}

	public function otp_submit_request(){
		if($this->input->post('save')){
			$this->form_validation->set_rules('password','Password','required|trim');
			$this->form_validation->set_rules('confirm_password','Confirm Password','required|trim|matches[password]');
			if($this->form_validation->run()){	
				$this->Smartsignup_model->add_user_after_verification();
			}
			
		}
	}
	public function smart_signup_session(){
		if($this->session->userdata('smart_temp_insert_id')){
			$mobile = $this->session->userdata('smart_temp_insert_mobile');
			$newstring = substr($mobile, -3);
			echo json_encode(array('error'=>0,'mob'=>$newstring));
			die;
		}
		else{
			echo json_encode(array('error'=>1,'redirect_url'=>'signup'));
			die;
		}
	}
	
	public function regenerate_otp(){
		$id = $this->session->userdata('smart_temp_insert_id');
		$this->Smartsignup_model->updateOtp($id);
	}
	public function check_user_otp(){
		$post = json_decode(file_get_contents("php://input"),1);
		$otp = $post['otp'];
		$id = $this->session->userdata('smart_temp_insert_id');
		$this->Smartsignup_model->checkOtp($id,$otp);
		die("ok"); 
	}
	
	
	
	/*Business Wizard First START*/
	public function business_step1_setup(){
		if($this->input->post('save')){
			$this->form_validation->set_rules('business_account_name','Account Name','required|trim');
			$this->form_validation->set_rules('business_domain_name','Subdomain Name','required|trim|is_unique['.$this->smart_businesses.'.subdomain]|callback_check_subdomain');
			if($this->form_validation->run()){
				$this->Smartsignup_model->add_business_step1();
			}
			else{
				$data['error'] = 1;
				if(form_error('business_account_name')){
					$data['account_name'] = strip_tags(form_error('business_account_name'));
				}
				if(form_error('business_domain_name')){
					$data['domain_name'] = strip_tags(form_error('business_domain_name'));
				}
				echo json_encode($data);
				die;				
			}
				
		}
	}
	function check_subdomain(){
		$subdomain = $this->input->post('business_domain_name');
		if(preg_match('/[^a-zA-Z0-9\d]/', $subdomain)){
			$this->form_validation->set_message('check_subdomain', 'Special symbol and white space not allowed');
			return false;
		}
		if(preg_match("/\\s/", $subdomain)){
			$this->form_validation->set_message('check_subdomain', 'Special symbol and white space not allowed');
			return false;
		}
		if(is_numeric($subdomain)){
			$this->form_validation->set_message('check_subdomain', 'All Digits Are Not Allowed');
			return false;
		}
		return true;
	}
	/*Business Wizard First LAST*/
	
	/*Business Wizard Second Step START*/
	public function business_step2_setup(){
		if($this->input->post('save')){
			$this->form_validation->set_rules('annual_turnover','Business Annual Turnover','required|trim');
			$this->form_validation->set_rules('city','City ','required|trim');
			$this->form_validation->set_rules('customers_count','Business coutomer count ','required|trim');
			$this->form_validation->set_rules('industry_type','Business industry type','required|trim');
			$this->form_validation->set_rules('people_count','Business employee count','required|trim');
			$this->form_validation->set_rules('postal_code','Postal code','required|trim');
			$this->form_validation->set_rules('smart_goal','Business goal','required|trim');
			$this->form_validation->set_rules('phone_number','Business Phone number','required|trim');
			if($this->form_validation->run()){
				$this->Smartsignup_model->add_business_step2();
			}
			else
			{
				$data = array();
				$data['error'] = 1;
				if(form_error('annual_turnover')){
					$data['annual_turnover_error'] = strip_tags(form_error('annual_turnover'));
				}
				if(form_error('city')){
					$data['city_error'] = strip_tags(form_error('city'));
				}
				if(form_error('customers_count')){
					$data['customers_count_error'] = strip_tags(form_error('customers_count'));
				}
				if(form_error('industry_type')){
					$data['industry_type_error'] = strip_tags(form_error('industry_type'));
				}
				if(form_error('people_count')){
					$data['people_count_error'] = strip_tags(form_error('people_count'));
				}
				if(form_error('postal_code')){
					$data['postal_code_error'] = strip_tags(form_error('postal_code'));
				}
				if(form_error('smart_goal')){
					$data['smart_goal_error'] = strip_tags(form_error('smart_goal'));
				}
				if(form_error('phone_number')){
					$data['phone_number_error'] = strip_tags(form_error('phone_number'));
				}
				echo json_encode($data);
				die;
			}
		}
	}

	/*Business Wizard Second Step END*/
	
	
	public function check_last_wizard(){
		$this->load->helper("sag_common_helper");
		$session_name = "sagsmart_login_data";
		$session_array = get_session($session_name);
		if($session_array){
			$user_id = $session_array['user_id'];
			$this->Smartsignup_model->check_last_wizard($user_id);
		}
		else{
			echo json_encode(array('current'=>0));
			die;
		}
	}
	
	public function complete_signup(){
		if($this->session->userdata('congratulation_step')){
			$this->session->unset_userdata('congratulation_step');
			$this->session->unset_userdata('wizard_step');
			echo json_encode(array('error'=>0,'success'=>1));
			die;
		}
	}
	
	
}
