<?php 
defined('BASEPATH') OR exit('No direct script access allowed');

include("Apps.php");
class Reports extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('video/reports_model');
		$this->conversion_type= ['lead'=>0,'promo'=>1,'share'=>2];	
	}
	
	public function basic_report(){
		$response['data'] = $this->reports_model->basic_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	public function basic_report_conversion(){
		$response['data'] = $this->reports_model->basic_report_conversion();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function traffic_report(){
		$response['data'] = $this->reports_model->traffic_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function operating_system_report(){
		$response['data'] = $this->reports_model->operating_system_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function browser_report(){
		$response['data'] = $this->reports_model->browser_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function device_report(){
		$response['data'] = $this->reports_model->device_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function location_report(){
		$response['data'] = $this->reports_model->location_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function conversion_report(){
		$conversion_type = $this->input->post('conversion_type') ? $_POST['conversion_type']:'promo';
		$conversion_type = $this->conversion_type[$conversion_type];
		$response['data'] = $this->reports_model->conversion_report($conversion_type);
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function engagment_report(){
		$response['data'] = $this->reports_model->engagment_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function video_engagment_report(){//pending
		$response['data'] = $this->reports_model->video_engagment_report();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function detail_list(){
		$response['data'] = $this->reports_model->detail_list();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
	
	public function compare(){
		$response['data'] = $this->reports_model->compare();
		$response['status'] = 'success';
		echo $this->jsonify($response);
	}
}