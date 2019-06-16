<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Smartbusinesses extends CI_Controller {
	function __construct()
	{
			// Construct the parent class
			parent::__construct();
			$this->config->load('smart_tables');
			$this->load->model(SMART_FOLDER.SMART_BUSINESS_FOLDER.'Smartbusinesses_model');
			$this->smart_businesses = $this->config->item('smart_businesses');	
			$this->load->helper("sag_common_helper");
		}

	public function smart_all_businesses()
	{
		$data['business_data'] = $this->Smartbusinesses_model->get_all_businesses();
		echo json_encode($data);
		die;
	}
	
	public function business_step1_setup(){
		if($this->input->post('save')){
			
			
			$this->form_validation->set_rules('business_account_name','Account Name','required|trim|callback_check_business_name');
			$this->form_validation->set_rules('business_domain_name','Subdomain Name','required|trim|is_unique['.$this->smart_businesses.'.subdomain]|callback_check_business_domain');
			$this->form_validation->set_message('is_unique', 'Already exist ! Please use different subdomain');
			if($this->form_validation->run()){
				$response = $this->Smartbusinesses_model->add_new_business1();
				if($response['business_id']){
					
					$session_array['business_name'] = $this->input->post('business_account_name');
					$session_array['business_id'] = $response['business_id'];
					$session_array['create_business_step'] = 1;
					$session_name = "sagsmart_create_business";
					generate_session($session_name,$session_array);
				}
				if($response['status'] == 1)
				{
					echo json_encode(array('error'=>0,'success'=>$response['status']));
					die;
				}
				else{
					echo json_encode(array('error'=>1,'success'=>$response['status'],'completed_step'=>1));
					die;
				}
				
				
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
				$response = $this->Smartbusinesses_model->add_new_business2();
				if($response == 1){
					$session_array['create_business_step'] = 2;
					$session_name = "sagsmart_create_business";
					generate_session($session_name,$session_array);
				}
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
	
	
	
	public function check_current_step(){ 
		$session_name = "sagsmart_create_business";
		$session_array = get_session($session_name);
		if($session_array){
			$create_business_step = $session_array['create_business_step'];
			echo json_encode(array('completed_step' => $create_business_step));
			die;
		}
		else{
			echo json_encode(array('completed_step' => 0));
			die;
		}
	}
	
	public function complete_create_business(){
		$this->session->unset_userdata('sagsmart_create_business');
		echo json_encode(array('error'=>0,'success'=>1));
		die;
	}
	public function check_business_domain(){
		$business_domain = $this->input->post('business_domain_name');
		
		$pattern = '/[\'\/~`\!@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:"\<\>,\.\?\\\]/';

		if (preg_match($pattern, $business_domain)){
			$this->form_validation->set_message('check_business_domain', 'Special Characters are not allowed !');
			return false;
			 
		}
		if(is_numeric($business_domain)){
			$this->form_validation->set_message('check_business_domain', 'All Numeric not allowed');
			return false;
		}
		if(preg_match('#[^A-Za-z0-9]#',$business_domain)){
			$this->form_validation->set_message('check_business_domain', 'Hello World !');
			return false;
		}
		return true;
	}
	public function check_business_name(){
		$business_account_name = $this->input->post('business_account_name');
		$pattern = '/[\'\/~`\!@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:"\<\>,\.\?\\\]/';
		if (preg_match($pattern, $business_account_name)){
			$this->form_validation->set_message('check_business_name', 'Special Characters are not allowed !');
			return false;
			 
		}
		if(is_numeric($business_account_name)){
			$this->form_validation->set_message('check_business_name', 'All Numeric not allowed');
			return false;
		}
		if(preg_match('#[^A-Za-z0-9 ]#',$business_account_name)){
			$this->form_validation->set_message('check_business_name', 'Alphabetic values are allowed');
			return false;
		}
		return true;
	}
	
	public function delete_business(){
		$post = json_decode(file_get_contents("php://input"),1);
		$delete_id = $post['delete_id'];
		$session_name = "sagsmart_login_data";
		$session_array = get_session($session_name);
		$user_id = $session_array['user_id'];
		$this->Smartbusinesses_model->delete_business($user_id,$delete_id);
	}
	
	public function update_active_status(){
		
		$session_name = "sagsmart_login_data";
		$session_array = get_session($session_name);
		$user_id = $session_array['user_id'];
		
		$post = json_decode(file_get_contents("php://input"),1);
		$subdomain = $post['subdomain'];
		$this->Smartbusinesses_model->activateStatus($user_id,$subdomain);
	}

}