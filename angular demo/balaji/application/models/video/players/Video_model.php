<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_Model extends CI_Model {
	function get_video_info($where, $select = array('*')){
		$this->db->select($select);
		$this->db->where($where);
		$query=$this->db->get('video_videos');
		$result=$query->row_array();
		return $result;
	}
	function get_video_video_stats($video_id, $select = array('*')){
		$this->db->select($select);
		$this->db->where('video_id',$video_id);
		$query=$this->db->get('video_video_stats');
		$result=$query->row_array();
		return $result;
	}
	function get_player_theme($theme_id, $select = array('*')){
		$this->db->select(implode(",",$select));
		$this->db->where('player_theme_id',$theme_id);
		if($theme_id > 30){
			$query=$this->db->get('video_player_themes');
		}else{
			$query=$this->db->get('video_player_themes_default');
		}

		if($query->num_rows() > 0){
			$result=$query->row_array();
			$result['elementsallowed'] = explode(',', $result['elementsallowed']);
			$result['logo'] = config_item('cdn_url').$result['logo'];
			return $result;
		}
		return null;
	}
	function get_frame_info($where, $select = array('*')){
		$this->db->select($select);
		$this->db->where($where);
		$query=$this->db->get('video_player_themes_default');
		$result=$query->row_array();
		return $result;
	}
	function get_sub_title($video_id){
		$this->db->select('subtitles');
		$this->db->where('video_id',$video_id);
		$query=$this->db->get('video_video_details');
		if($query->num_rows()){
			return $query->row()->subtitles;
		}else{
			return '';
		}
	}
	
	function init_stats(){
		$video_id = $_POST['video_id'];
		$select = array("business_id", "project_id");
		$video_info 	= $this->get_video_info(array('video_id'=>$video_id), $select);
		$video_video_stats 	= $this->get_video_video_stats($video_id, 'duration');
		$tech_stats 	= $this->get_tech_stats();
		$geo_stats 		= $this->get_geo_stats();

		$InsertArray = array(
			'business_id' 		=> $video_info['business_id'],
			'project_id' 		=> $video_info['project_id'],
			'video_id' 			=> $video_id,
			'session_id' 		=> session_id(),
			'visitor_id' 		=> $_POST['visitor_id'],
			'visitor_session_id' => $_POST['visitor_session_id'],
			'meta_key' 			=> $this->input->post('meta_key'),
			'meta_value' 		=> $this->input->post('meta_value'),
			'duration' 			=> $video_video_stats['duration'],
			'played_time' 		=> 0,
			'played_stats' 		=> '[]',
			'buffered_time' 	=> 0,
			'buffered_stats' 	=> '[]',
			'modified' 			=> time(),
			'created' 			=> time()
		);

		$this->db->insert('video_video_visitors', $InsertArray);
		$stat_id =   $this->db->insert_id();

		$this->db->where('video_id', $video_id);
		$this->db->set('view_count', '`view_count`+ 1', FALSE);
		$this->db->update('video_video_stats');
		echo json_encode(array('stat_id' => $stat_id));
	}
	function update_stats(){
		$stat_id = $_POST['stat_id'];
		$video_id = $_POST['video_id'];
		
		$this->db->select('played_time');
		$this->db->where('id', $stat_id);
		$query = $this->db->get('video_video_visitors');
		$played_time = $query->row()->played_time;
		
		if($played_time == 0){
			$this->db->where('video_id', $video_id);
			$this->db->set('play_count', '`play_count`+ 1', FALSE);
			$this->db->update('video_video_stats');
		}
		
		$data = array(
			'played_time' 		=> $_POST['played_time'],
			'played_stats' 		=> $_POST['played_stats'],
			'buffered_time' 	=> $_POST['buffered_time'],
			'buffered_stats' 	=> $_POST['buffered_stats'],
			'modified' 			=> time()
		);

		$this->db->where('id', $_POST['stat_id']);
		$this->db->where('video_id', $video_id);
		$this->db->update('video_video_visitors', $data);
		echo json_encode(array('stat_id' => $stat_id));
	}
	
	
	
	/* need attention*/
	function get_video_ads($video_id, $select = array('*')){
		$this->db->select(implode(",",$select));
		$this->db->where('video_id',$video_id);
		$this->db->where('type!=','P');
		$query=$this->db->get('video_ads');
		$result=$query->result_array();
		return $result;
	}
	function get_video_persnalise_ads($video_id, $select = array('*')){
		$this->db->select(implode(",",$select));
		$this->db->where('video_id',$video_id);
		$this->db->where('type','P');
		$query=$this->db->get('video_ads');
		$result=$query->result_array();
		return $result;
	}
	function get_video_ad_info($video_ad_id, $select = array('*')){
		$this->db->select(implode(",",$select));
		$this->db->where('id',$video_ad_id);
		$query=$this->db->get('video_ads');
		$result=$query->row_array();
		return $result;
	}
	function get_channel_info($business_id, $select = array('*')){
		$this->db->select($select);
		$this->db->where('business_id',$business_id);
		$query=$this->db->get('video_channels');
		$result=$query->row_array();
		return $result;
	}	
	
	function setstats(){
		if($this->session->userdata('video_'.$_REQUEST['video_slug'])){
			// return json_encode(array('stat_id' => 0)); 
		}
		$video_slug = $_REQUEST['video_slug'];
		$select = array("id", "channel_id", "project_id");
		$video_info 	= $this->get_video_info(array('slug'=>$video_slug), $select);
		$video_video_stats 	= $this->get_video_video_stats($video_info['id'], ['video_lenght']);
		$tech_stats 	= $this->get_tech_stats();
		$geo_stats 		= $this->get_geo_stats();

		$InsertArray = array(
			'channel_id' 		=> $video_info['channel_id'],
			'project_id' 		=> $video_info['project_id'],
			'video_id' 			=> $video_info['id'],
			'session_id' 		=> session_id(),
			'stat_key' 			=> isset($_REQUEST["stat_key"]) ? $_REQUEST["stat_key"] : '',
			'played_time' 		=> 0,
			'duration' 			=> $video_video_stats['video_lenght'],
			'played_stats' 		=> '',
			'seen_last' 		=> 0,
			'buffered_stats' 	=> '',
			'referer_url' 		=> isset($_SERVER["HTTP_REFERER"]) ? $_SERVER["HTTP_REFERER"] : '',
			'ip' 				=> $_SERVER['REMOTE_ADDR'],
			'user_agent' 		=> $_SERVER["HTTP_USER_AGENT"],
			'browser' 			=> $tech_stats['browser'],
			'operating_system' 	=> $tech_stats['os_system'],
			'device' 			=> $tech_stats['device'],
			'country_code' 		=> $geo_stats["geoplugin_countryCode"],
		);

		$this->db->insert('video_visitors', $InsertArray);
		$stat_id =   $this->db->insert_id();

		$this->db->where('video_id', $video_info['id']);
		$this->db->set('view_count', '`view_count`+ 1', FALSE);
		$this->db->update('video_video_stats');
		return json_encode(array('stat_id' => $stat_id));
	}
	function get_tech_stats(){
		$u_agent = strtolower($_SERVER["HTTP_USER_AGENT"]);
		preg_match("/mobile|android|iphone/", $u_agent, $matches);
		$dvc = current($matches);
		$device_type='desktop'; 
		switch($dvc){
			case 'mobile':		$device_type='mobile';		break;
			case 'android':		$device_type='mobile';		break;
			case 'iphone':		$device_type='mobile';		break;
		}
		
		
		if($device_type=='mobile'){
			preg_match("/iphone|android|ipad|ipod|windows/", $u_agent, $matches);
			$os = current($matches);
			$os_system='os_other'; 
			switch($os){
				case 'android': 		$os_system='android';	break;
				case 'iphone': 			$os_system='ios'; 		break;
				case 'ipad': 			$os_system='ios';		break;
				case 'ipod': 			$os_system='ios';		break;
				case 'windows':			$os_system='windows_mobile';	break;
			}

			preg_match("/msie|trident|opera|netscape|safari|chrome|firefox/", $u_agent, $matches);
			$bwsr = current($matches);
			$browser='browser_other'; 
			switch($bwsr){
			   case 'msie': 		$browser='ie'; 			break;
			   case 'trident': 		$browser='ie';			break;
			   case 'opera': 		$browser='opera';		break;
			   case 'netscape': 	$browser='netscape';	break;
			   case 'safari':		$browser='safari';		break;
			   case 'chrome':		$browser='chrome';		break;
			   case 'firefox': 		$browser='firefox';		break;
			}
			
			preg_match("/iphone|android|ipad|ipod|windows/", $u_agent, $matches);
			$dvc = current($matches);
			$device='dvc_other'; 
			switch($dvc){
				case 'iphone': 		$device='iphone'; 			break;
				case 'android': 	$device='android';			break;
				case 'ipad': 		$device='ipad';				break;
				case 'ipod': 		$device='dipod';				break;
				case 'windows':		$device='windows_phone';	break;
			}
			
		}
		else{
			preg_match("/linux|macintosh|mac|win32|windows/", $u_agent, $matches);
			$os = current($matches);
			$os_system='os_other'; 
			switch($os){
				case 'linux': 			$os_system='linux';		break;
				case 'macintosh': 		$os_system='macintosh';	break;
				case 'mac': 			$os_system='mac';		break;
				case 'win32': 			$os_system='windows';	break;
				case 'windows':			$os_system='windows';	break;
				case 'wow64':			$os_system='windows';	break;
			}

			preg_match("/msie|trident|opera|netscape|chrome|safari|firefox/", $u_agent, $matches);
			$bwsr = current($matches);
			$browser='browser_other'; 
			switch($bwsr){
			   case 'msie': 		$browser='ie'; 			break;
			   case 'trident': 		$browser='ie';			break;
			   case 'opera': 		$browser='opera';		break;
			   case 'netscape': 	$browser='netscape';	break;
			   case 'safari':		$browser='safari';		break;
			   case 'chrome':		$browser='chrome';		break;
			   case 'firefox': 		$browser='firefox';		break;
			}
			if(strpos('saglus'.$u_agent, 'opr')>0){
				$browser='bwr_Opera';
			}
			
			preg_match("/linux|macintosh|mac|windows|win32/", $u_agent, $matches);
			$dvc = current($matches);
			$device='dvc_other'; 
			switch($dvc){
				case 'linux': 		$device='desktop';			break;
				case 'macintosh': 	$device='desktop';			break;
				case 'mac': 		$device='desktop';			break;
				case 'windows': 	$device='desktop';			break;
				case 'win32': 		$device='desktop';			break;
				case 'wow64': 		$device='desktop';			break;
			}
			
		}
		
		if($device == 'android'){
			$detect = new Mobile_Detect();
			if( $detect->isTablet()) 
			{ 
				$device .=  ' tablet'; 
			}
			elseif ( $detect->isMobile() ) 
			{
				$device .=  ' mobile'; 	
			}
			else 
			{ 
				$device = 'desktop'; 
			}
		}
		return array(
					"browser" => $browser,
					"os_system" => $os_system,
					"device" => $device
				);
	}
	function get_geo_stats(){
		$ip=$_SERVER['REMOTE_ADDR'];
		// $ip='122.15.14.173';
		$getgeodata="http://www.geoplugin.net/php.gp?ip=".$ip;
		$ch = curl_init ();
		curl_setopt ( $ch, CURLOPT_URL, $getgeodata );
		curl_setopt ( $ch, CURLOPT_SSL_VERIFYPEER, false );
		curl_setopt ( $ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13' );
		curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
		$result = curl_exec ( $ch );
		curl_close ( $ch );		
		return unserialize($result);
	}
	
	function updatestats(){
		$Ctime = $_POST['Ctime'];
		$StatID = $_POST['StatID'];
		$type = $_POST['type'];

		if($type=="regularTime"){
			$this->db->where('id', $StatID);
			$this->db->set('seen_last', $Ctime);
			$this->db->update('video_visitors');
		}
		elseif($type=="playTime"){
			$str = "'{".$_POST['Ctime']."-'";
			$this->db->where('id', $StatID);
			$this->db->set('played_stats', 'CONCAT(`played_stats`,'.$str.')', FALSE);
			$this->db->update('video_visitors');
		}
		elseif($type=="pauseTime"){
			$str = "'".$_POST['Ctime']."}'";
			$this->db->where('id', $StatID);
			$this->db->set('played_stats', 'CONCAT(`played_stats`,'.$str.')', FALSE);
			$this->db->update('video_visitors');
		}
		elseif($type=="changeseekTime"){
			$this->db->select('seen_last');
			$this->db->where('id',$StatID);
			$query=$this->db->get('video_visitors');
			$video_video_stats=$query->row_array();
			
		
			// $str = "'".$_POST['Ctime']."}{".$_POST['newTime']."-'";
			$str = "'".$video_video_stats['seen_last']."}{".$_POST['newTime']."-'";
			$newTime = $_POST['newTime'];
			$this->db->where('id', $StatID);
			$this->db->set('seen_last', $newTime);
			$this->db->set('played_stats', 'CONCAT(`played_stats`,'.$str.')', FALSE);
			$this->db->update('video_visitors');
		}

		
		$this->db->select('video_id, duration, played_stats, seen_last');
		$this->db->where('id',$StatID);
		$query=$this->db->get('video_visitors');
		$video_visitors=$query->row_array();
		
		$duration 	= $video_visitors['duration'];
		$played_stats = $video_visitors['played_stats'].$video_visitors['seen_last'].'}';
		$played_time = 0;
		$played_time = $this->GetViewPart($played_stats);
		if($played_time > $duration){
			$played_time = $duration;
		}
		
		if($played_time!=0){
			$this->db->where('id', $StatID);
			$this->db->set('played_time', $played_time);
			$this->db->update('video_visitors');
		}

		$slug = end(explode('/', current(explode('?', $_SERVER['HTTP_REFERER']))));
		echo json_encode(array('stat_id' => $StatID, 'played_time' => $played_time));
	}
	function GetViewPart($data){ //used by other
		$DataArray = array();
		//$data  = "{2-8}{7-11}{8-9}{10-11}{18-26}{20-25}{22-23}{30-40}{40-56}{55-60}";
		$data1 = explode("{",$data);
		foreach ($data1  as $temparr){ 
			$data2 = explode("-",$temparr);
			if($data2[0]!='' && sizeof($data2)>1 && $data2[1]!='' && $data2[1]!='}' )
			{	
				$data2[1] = substr($data2[1], 0, strpos($data2[1], "}"));
				$DataArray[] = $data2;
			}
		}
		if(sizeof($DataArray)){
		$newdata = array();
		$newdata[] = $DataArray[0];
		for ($i=1; $i < sizeof($DataArray); $i++){
			for ($j=1; $j < sizeof($DataArray); $j++){
				if($newdata[sizeof($newdata)-1][0] > $DataArray[$j][0] && $newdata[sizeof($newdata)-1][0] < $DataArray[$j][1]){
					$newdata[sizeof($newdata)-1][0] = $DataArray[$j][0];
				}
				if($newdata[sizeof($newdata)-1][1] > $DataArray[$j][0] && $newdata[sizeof($newdata)-1][1] < $DataArray[$j][1]){
					$newdata[sizeof($newdata)-1][1] = $DataArray[$j][1];
				}
			}
			$addlastelement = true;
			foreach($newdata as $tempArr){
				if($tempArr[0] <= $DataArray[$i][0] && $tempArr[0] <= $DataArray[$i][1] && $tempArr[1] >= $DataArray[$i][0] && $tempArr[1] >= $DataArray[$i][1]){
					$addlastelement = false;
				}
			}
			if($addlastelement){
				$newdata[] = $DataArray[$i];
			}
		}
		for ($j=1; $j < sizeof($DataArray); $j++){
			if($newdata[sizeof($newdata)-1][0] > $DataArray[$j][0] && $newdata[sizeof($newdata)-1][0] < $DataArray[$j][1]){
					//echo "{".$DataArray[$j][0]."-".$DataArray[$j][1]."}";
					$newdata[sizeof($newdata)-1][0] = $DataArray[$j][0];
			}
			if($newdata[sizeof($newdata)-1][1] > $DataArray[$j][0] && $newdata[sizeof($newdata)-1][1] < $DataArray[$j][1]){
				$newdata[sizeof($newdata)-1][1] = $DataArray[$j][1];
			}
		}
		$PreFinalData = array();
		$PreFinalData1 = array_unique($newdata, SORT_REGULAR);
		foreach ($PreFinalData1  as $temparr){ 
		$PreFinalData[] = $temparr;
		}
		for ($i=0; $i < sizeof($PreFinalData); $i++){
			for ($j=0; $j < sizeof($PreFinalData); $j++){
				if($PreFinalData[$i][1]==$PreFinalData[$j][1]){
					if($PreFinalData[$i][0]>$PreFinalData[$j][0]){
						$PreFinalData[$i][0] = $PreFinalData[$j][0];
					}
				}
			}
		}
		$FinalData = array();
		$ViewTime = 0;
		$FinalData1 = array_unique($PreFinalData, SORT_REGULAR);
		foreach ($FinalData1  as $temparr){ 
		$FinalData[] = $temparr;
		$ViewTime = $ViewTime+ $temparr[1]-$temparr[0];
		}
		
		return $ViewTime;
		}
		return 0;
	}
	
	function VideoDuration($VideoName){ //used by other
		$this->db->select('*');
		$this->db->where('video_name',$VideoName);
		$query=$this->db->get('va_videos');
		$result=$query->row();
		$Duration = $result->Duration;
		$regex_duration = "/([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}).([0-9]{1,2})/";
		if (preg_match($regex_duration, $Duration, $regs)) {
			$hours = $regs [1] ? $regs [1] : null;
			$mins = $regs [2] ? $regs [2] : null;
			$secs = $regs [3] ? $regs [3] : null;
			$ms = $regs [4] ? $regs [4] : null;
		}
		if(isset($secs) && isset($mins) && isset($hours)){
			return $Duration_sec = $secs+($mins+$hours*60)*60;
		}else{
			return 0;
		}
	}
}