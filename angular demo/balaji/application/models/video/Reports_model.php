<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reports_model extends CI_Model{

	
	/** Helper Function **/
	function set_where(){
		if($this->input->post('business_id')){
			$this->db->where('video_video_visitors.business_id',$this->input->post('business_id'));			
		}
		if($this->input->post('project_id')){
			$this->db->where('video_video_visitors.project_id',$this->input->post('project_id'));
		}
		if($this->input->post('video_id')){
			$this->db->where('video_video_visitors.video_id',$this->input->post('video_id'));	
		}		
	}
	function set_dates(){
		if($this->input->post('start_date')){
			$this->db->where('video_video_visitors.created >=', strtotime($this->input->post('start_date')));
		}
		if($this->input->post('end_date')){
			$this->db->where('video_video_visitors.created <=', strtotime($this->input->post('end_date'))+86400);
		}
	}
	function get_date_formate(){		
		$keyword = $this->input->post('keyword') ? $this->input->post('keyword') : 'monthwise';
		$date_formate = [
							'daywise' 	=> '%M %d %Y',
							'weekwise' 	=> '%X-%V',
							'monthwise' => '%Y-%m-01',
						];
		return $date_formate[$keyword];
	}
	
	/** main graph function start **/
	function basic_report(){
		$this->db->select( "COUNT('id') as  view_count");
		$this->db->select("COUNT(if(played_time > 0, 1, null)) as play_count");
		$this->db->select("AVG(played_time/duration)*100 as engage");
		$this->set_where();
		$this->set_dates();		
		$this->db->group_by('business_id');			
		$query = $this->db->get('video_video_visitors');
		$data =  $query->row_array();
		if($data){
			return $data;
		}else{
			return array('view_count'=>0,'play_count'=>0,'engage'=>0,'view_count'=>0);
		}
	}
	function basic_report_conversion(){
		$this->db->select("smart_conversions.id");
		$this->set_where();
		$this->set_dates();
		$this->db->join("smart_conversions",'video_video_visitors.visitor_id = smart_conversions.visitor_id','inner');
		$this->db->where('smart_conversions.conversion_status', 1);
		$this->db->group_by('video_video_visitors.visitor_id');
		$this->db->group_by('campaign_id');
		$this->db->get('video_video_visitors');
		$tbl = $this->db->last_query();

		$this->db->reset_query();
		$this->db->select('count(*) conversions');
		$query = $this->db->get('(' .$tbl.') as tbl');
		return $query->row_array();
	}

	function traffic_report(){
		$this->db->select("from_unixtime(video_video_visitors.created,'".$this->get_date_formate()."') as new_date");
		$this->db->select("COUNT(`visitor_id`) as visitor");
		$this->db->select("COUNT(DISTINCT(`visitor_id`)) as unique_visitor");
		$this->set_where();
		$this->set_dates();
		$this->db->group_by('new_date');
		$query = $this->db->get('video_video_visitors');
		return $query->result_array();
		//print_r($this->db->last_query()); die;
	}
	
	function operating_system_report(){
		$this->db->select("operating_system, COUNT(video_video_visitors.visitor_id) as visitor");
		$this->db->select("COUNT(DISTINCT(video_video_visitors.visitor_id)) as unique_visitor");
		$this->db->select("COUNT(if(played_time > 0, 1, null)) as play_count");
		$this->db->join('smart_visitors','video_video_visitors.visitor_id = smart_visitors.visitor_id','Left');
		$this->set_where();
		$this->set_dates();
		$this->db->group_by('operating_system');
		$query = $this->db->get('video_video_visitors');
		// die($this->db->last_query());
		return $query->result_array();
	}
	function browser_report(){
		$this->db->select("browser, COUNT(video_video_visitors.visitor_id) as visitor");
		$this->db->select("COUNT(DISTINCT(video_video_visitors.visitor_id)) as unique_visitor");
		$this->db->select("COUNT(if(played_time > 0, 1, null)) as play_count");
		$this->db->join('smart_visitors','video_video_visitors.visitor_id = smart_visitors.visitor_id','Left');
		$this->set_where();
		$this->set_dates();
		$this->db->group_by('browser');
		$query = $this->db->get('video_video_visitors');
		// die($this->db->last_query());
		return $query->result_array();
	}
	function device_report(){
		$this->db->select("device, COUNT(video_video_visitors.visitor_id) as visitor");
		$this->db->select("COUNT(DISTINCT(video_video_visitors.visitor_id)) as unique_visitor");
		$this->db->select("COUNT(if(played_time > 0, 1, null)) as play_count");
		$this->db->join('smart_visitors','video_video_visitors.visitor_id = smart_visitors.visitor_id','Left');
		$this->set_where();
		$this->set_dates();
		$this->db->group_by('device');
		$query = $this->db->get('video_video_visitors');
		// die($this->db->last_query());
		return $query->result_array();
	}
	function location_report(){
		$this->db->select("country_id, COUNT(video_video_visitors.visitor_id) as visitor");
		$this->db->select("COUNT(DISTINCT(video_video_visitors.visitor_id)) as unique_visitor");
		$this->db->select("COUNT(if(played_time > 0, 1, null)) as play_count");
		$this->db->select("AVG(played_time/video_video_visitors.duration)*100 as engage");
		$this->db->select("COUNT(if(conversion_status = 1, 1, null)) as conversions");
		$this->db->join('video_video_stats','video_video_visitors.video_id = video_video_stats.video_id','left');
		$this->db->join('smart_conversions','smart_conversions.visitor_session_id = video_video_visitors.visitor_session_id','left');
		$this->db->join('smart_visitor_sessions','video_video_visitors.visitor_session_id = smart_visitor_sessions.visitor_session_id','left');
		$this->set_where();
		$this->set_dates();
		$this->db->group_by('country_id');
		$query = $this->db->get('video_video_visitors');
		// die($this->db->last_query());
		return $query->result_array();
	}
	function conversion_report($conversion_type=1){
		$this->db->select("from_unixtime(video_video_visitors.created,'".$this->get_date_formate()."') as new_date");
		$this->db->select("COUNT(conversion_status) as visitors");
		$this->db->select("COUNT(if(conversion_status = 1, 1, null)) as conversions");
		$this->db->join('smart_conversions','smart_conversions.visitor_session_id = video_video_visitors.visitor_session_id','left');
		$this->set_where();
		$this->set_dates();
		$this->db->where('smart_conversions.conversion_type', $conversion_type);
		$this->db->group_by('new_date');
		$query = $this->db->get('video_video_visitors');
		//die($this->db->last_query());
		return $query->result_array();
	}
	function engagment_report(){
		$this->db->select("from_unixtime(video_video_visitors.created,'".$this->get_date_formate()."') as new_date");
		$this->db->select("COUNT(`visitor_id`) as visitor");
		$this->db->select("COUNT(if(played_time > 0, 1, null)) as play_count");
		$this->db->select("AVG(played_time/video_video_visitors.duration)*100 as engage");
		$this->db->join('video_video_stats','video_video_visitors.video_id = video_video_stats.video_id','left');
		$this->set_where();
		$this->set_dates();
		$this->db->group_by('new_date');
		$query = $this->db->get('video_video_visitors');
		// die($this->db->last_query());
		return $query->result_array();
	}	
	function video_engagment_report(){
		// pending
	}
	function compare(){
		
		$data['basic_report'] 	= $this->basic_report();

		$data['browser_report'] = $this->browser_report();

		$data['operating_system_report'] = $this->operating_system_report();

		$data['device_report'] 	= $this->device_report();

		$data['location_report'] = $this->location_report();
		return $data;

	}	
	function detail_list(){
		if($this->input->post('project_id')){		
		$this->db->select('video_videos.video_id,title,video_videos.created_date,view_count,AVG(played_time_avg/video_video_stats.duration)*100 as engage,COUNT(smart_conversions.id) as conversions');
		$this->db->join('video_video_stats','video_video_stats.video_id = video_videos.video_id','Left');
		$this->db->join('video_video_visitors','video_videos.video_id= video_video_visitors.video_id','Left');
		$this->db->join("smart_conversions",'video_video_visitors.visitor_id = smart_conversions.visitor_id And smart_conversions.conversion_status = 1' ,'left');	
		$this->db->where('video_videos.project_id',$this->input->post('project_id'));	
	    $this->db->group_by('video_videos.video_id');
		$query = $this->db->get('video_videos');
		//print_r($this->db->last_query()); die;
		return $query->result_array();	
		}
		elseif($this->input->post('business_id')){
		$this->db->select('smart_projects.project_id,smart_projects.title,smart_projects.created_date,view_count,AVG(played_time_avg/video_video_stats.duration)*100 as engage,COUNT(smart_conversions.id) as conversions');
		$this->db->join('video_videos','smart_projects.project_id = video_videos.project_id','Left');
		$this->db->join('video_video_stats','video_video_stats.video_id = video_videos.video_id','Left');
		$this->db->join('video_video_visitors','video_videos.video_id= video_video_visitors.video_id','Left');
		$this->db->join("smart_conversions",'video_video_visitors.visitor_id = smart_conversions.visitor_id And smart_conversions.conversion_status = 1' ,'left');	
		$this->db->where('smart_projects.business_id',$this->input->post('business_id'));	
	    $this->db->group_by('smart_projects.project_id');
		$query = $this->db->get('smart_projects');
		//print_r($this->db->last_query()); die;
		return $query->result_array();	
		
			
		}
	}
}

	
	
	 
		
		
		

	
