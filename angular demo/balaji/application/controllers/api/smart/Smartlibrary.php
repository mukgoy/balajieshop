<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Smartlibrary extends CI_Controller {
	
	function __construct()
		{
			// Construct the parent class
			parent::__construct();
			$this->config->load('smart_tables');
			$this->load->model(SMART_FOLDER.'Smartlibrary_model');
		}	
	public function get_country_list()
	{
		$this->Smartlibrary_model->get_country_list();	
	}
	public function get_state_list_by_country_id($id)
	{
		$this->Smartlibrary_model->get_state_list_by_country_id($id);	
	}
	
	
	public function business_industry_type(){
		$this->Smartlibrary_model->get_all_data_from_table($this->config->item('smart_business_industry_type'));
	}
	public function business_turnover_master(){
		$this->Smartlibrary_model->get_all_data_from_table($this->config->item('smart_business_turnover_master'));
	}
	public function business_goal_master(){
		$this->Smartlibrary_model->get_all_data_from_table($this->config->item('smart_business_goal_master'));
	}
	public function business_employee_master(){
		$this->Smartlibrary_model->get_all_data_from_table($this->config->item('smart_business_employee_master'));
	}
	public function business_customer_master(){
		$this->Smartlibrary_model->get_all_data_from_table($this->config->item('smart_business_customer_master'));
	}
	
	
	public function get_cities_by_phone(){
		$post = json_decode(file_get_contents("php://input"),1);
		$id = str_replace("+",'',$post['id']);
		$id = trim($id);
		$this->Smartlibrary_model->get_cities_by_phone_id($id);
	}
	
	
	
}