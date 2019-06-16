<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Processor_Model extends CI_model {
	public function get_ffmpeg_queue($where, $select = array('*')){
		$this->db->select(implode(",",$select));
		$this->db->where($where);
		$query=$this->db->get('video_ffmpeg_queue');
		return $query->result_array();
	}

	public function get_ffmpeg_instance_count(){
		$this->db->where('status', 'process1');
		$this->db->or_where('status', 'process2');
		return $this->db->count_all_results('video_ffmpeg_queue');
	}

	public function set_ffmpeg_video_status($video_id, $status){
		$this->db->set('status', $status);
		$this->db->where('video_id', $video_id);
		$this->db->update('video_ffmpeg_queue');
	}
	
	public function set_ffmpeg_video_processed($video_id, $process_status){
		$this->db->set('processed', $process_status);
		$this->db->where('video_id', $video_id);
		$this->db->update('video_ffmpeg_queue');
	}
	
	public function delete_s3_moved(){
		$this->db->select('video_id,video_slug,folder');
		$this->db->where('status', 'move_s3_done');
		//$this->db->where('modified <', date('Y-m-d',strtotime(date('Y-m-d').'-1 day')));
		$query = $this->db->get('video_ffmpeg_queue');
		$ffmpeg_queue = $query->result_array();
		
		foreach($ffmpeg_queue as $queue){
			$this->delete_dir($queue['folder']);
		}
	}

	public function delete_dir($dir){
		if(is_dir($dir)){
			foreach (directory_map($dir,1) as $item) {
				if ($item == '.' || $item == '..') continue;
				unlink($dir.DIRECTORY_SEPARATOR.$item);
			}
			rmdir($dir);
		}
	}
	
	function process_status($status_file){
		$output = read_file($status_file);
		if(strpos($output,"Duration")){
			$regex_duration = "/Duration: ([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}).([0-9]{1,2})/";
			if (preg_match($regex_duration, $output, $regs)){
				$hours = $regs [1] ? $regs [1] : null;
				$mins = $regs [2] ? $regs [2] : null;
				$secs = $regs [3] ? $regs [3] : null;
				$ms = $regs [4] ? $regs [4] : null;
			}
			$total_ms = $ms+($secs+($mins+$hours*60)*60)*1000;
			
			//start to get last line from txt file.
			$LastLine = '';
			$f = fopen($status_file, 'r');
			$cursor = -1;
			fseek($f, $cursor, SEEK_END);
			$char = fgetc($f);
			while ($char === "\n" || $char === "\r") {
				fseek($f, $cursor--, SEEK_END);
				$char = fgetc($f);
			}
			while ($char !== false && $char !== "\n" && $char !== "\r") {
				$LastLine = $char . $LastLine;
				fseek($f, $cursor--, SEEK_END);
				$char = fgetc($f);
			}
			//end to get last line from txt file.
			
			//start to get current time in milisecond.	
			if(strpos($LastLine,"Non-monotonous DTS")){
				return 0;
			}
			if(strpos($output,"time=")){
				if(!strpos($LastLine,"time=")){
					return 100;
				}
				$current_ms = 0;
				$regex_duration = "/time=([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}).([0-9]{1,2})/";
				if (preg_match($regex_duration, $LastLine, $regs)) {
					$hours = $regs [1] ? $regs [1] : null;
					$mins = $regs [2] ? $regs [2] : null;
					$secs = $regs [3] ? $regs [3] : null;
					$ms = $regs [4] ? $regs [4] : null;
					$current_ms = $ms+($secs+($mins+$hours*60)*60)*1000;
				}
				//end to get current time in milisecond.
				if($current_ms>=0){
					return $current_ms/$total_ms*100;
				}
			}
			else{
				return 0;
			}
		}
		else{
			return 0;
		}
	}
	
	function make_resolution($queue){
		if(is_dir('./'.$queue['folder'])){
			$preset = "superfast";
			$source_file = config_item('base_url').$queue['folder'].$queue['file_name'];
			$video_basefolder = $this->root_base().$queue['folder'];
			
			$cmd720P = $cmd480P = $cmd360P = $cmd240P = '';
			if($queue['height'] >= 720){
				$destinationFile = $video_basefolder.$queue['video_slug'].'_720P.mp4';
				$cmd720P = "-c:v libx264 -preset ".$preset." -vf scale=1280x720 ".$destinationFile;
			}
			if($queue['height'] >= 480){
				$destinationFile = $video_basefolder.$queue['video_slug'].'_480P.mp4';
				$cmd480P = "-c:v libx264 -preset ".$preset." -vf scale=858x480 ".$destinationFile;
			}
			if($queue['height'] >= 360){
				$destinationFile = $video_basefolder.$queue['video_slug'].'_360P.mp4';
				$cmd360P = "-c:v libx264 -preset ".$preset." -vf scale=640x360 ".$destinationFile;
			}
			$destinationFile = $video_basefolder.$queue['video_slug'].'_240P.mp4';
			$cmd240P = "-c:v libx264 -preset ".$preset." -vf scale=384x216 ".$destinationFile;
			$convertStatus 		= $video_basefolder.'status_process1.txt';
			
			$ffmpeg = config_item('ffmpeg');
			$cmd = "$ffmpeg -i $source_file $cmd720P $cmd480P $cmd360P $cmd240P > $convertStatus 2>&1 &";
			$output = shell_exec($cmd);
		}
	}
	
	function root_base(){
		return $_SERVER['DOCUMENT_ROOT'].'/'.$GLOBALS['base_path'];
	}
	
}
