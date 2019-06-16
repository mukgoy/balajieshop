<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Videoprocess extends CI_Controller {
	
	function __construct(){ 
	    parent::__construct();	
		$this->load->model("video/processor/processor_model");
		$this->load->model("video/processor/video_model");
		$this->load->library('amazons3');
		$GLOBALS['repeat_count'] = 1;
		$GLOBALS['ffmpeg_instance_limit'] = 3;
		
		$GLOBALS['basefolder_root'] = $_SERVER['DOCUMENT_ROOT'].'/'.config_item('base_path');
		$GLOBALS['tempfolder_root']	 = $GLOBALS['basefolder_root'].'uploads/temp/';
		$GLOBALS['videofolder_root'] = $GLOBALS['tempfolder_root'].'{{slug}}/';
		$GLOBALS['tempfolder_url'] 	 = config_item('base_url').'uploads/temp/';
		$GLOBALS['videofolder_url']	 = $GLOBALS['tempfolder_url'].'{{slug}}/';		
	}
	function index(){
		$this->check_readytomove_s3();
		$this->check_readytoprocess2();
		$this->check_process1_done();
		$this->check_readytoprocess1();
		$this->processor_model->delete_s3_moved();
		$GLOBALS['repeat_count'] = $GLOBALS['repeat_count'] + 1;
		if($GLOBALS['repeat_count'] < 8){$this->index();}
	}
	
	function check_readytomove_s3(){
		$ffmpeg_queue = $this->processor_model->get_ffmpeg_queue(array('status'=>'process2_done'), ['business_id,video_id,video_slug,file_name,folder']);
		foreach($ffmpeg_queue as $queue){
				//if($this->is_delete($queue)){return;}
				$this->processor_model->set_ffmpeg_video_status($queue['video_id'], 'move_s3');
				$this->move_video_s3($queue);
				$this->processor_model->set_ffmpeg_video_status($queue['video_id'], 'move_s3_done');
				$this->video_model->set_video_url($queue);
		}
	}
	function move_video_s3($queue){
		$dir = './'.$queue['folder'];
		if(is_dir($dir)){
			foreach (directory_map($dir,1) as $item) {
				if ($item == '.' || $item == '..') continue;
				$aws_folder = 'uploads/businesses/'.$queue['business_id'].'/video/videos/'.$queue['video_slug'].'/';
				$this->amazons3->uploadAWS($queue['folder'].$item, $aws_folder.$item, config_item('bucket'));
			}
		}
	}
	
	function check_readytoprocess2(){
		$ffmpeg_queue = $this->processor_model->get_ffmpeg_queue(array('status'=>'process1_done'), ['video_id,video_slug,file_name,folder,height']);
		$mp4box = config_item('mp4box');
		foreach($ffmpeg_queue as $queue){
			$filepath_mpd = $this->processor_model->root_base().$queue['folder'].'mpd.mpd';
			$videofolder_root = $this->processor_model->root_base().$queue['folder'];
			
			$cmd = "$mp4box -dash 2000 -rap -frag-rap -profile onDemand -out $filepath_mpd";
			$videos = array();
			foreach (directory_map($queue['folder'],1) as $item){
				if(strpos($item, '.mp4') && strpos($item, '_')) {
					$cmd .= " ".$videofolder_root.$item."#video";
				}
				if(strpos($item, '_240P.mp4')){
					$audio = $videofolder_root.$item;
				}
			}
			$cmd .= " ".$audio."#audio";
			$output = shell_exec($cmd);
			$this->processor_model->set_ffmpeg_video_status($queue['video_id'], 'process2_done');
		}
	}
	
	function check_process1_done(){
		$ffmpeg_queue = $this->processor_model->get_ffmpeg_queue(array('status'=>'process1'), ['video_id,video_slug,file_name,folder,height']);
		$status = array();
		foreach($ffmpeg_queue as $queue){
			$status_file = './'.$queue['folder'].'status_process1.txt';
			$process_status = $this->processor_model->process_status($status_file);
			$status[$queue['video_id']] = $process_status;
			$this->processor_model->set_ffmpeg_video_processed($queue['video_id'], $process_status);
			if($process_status == 100){
				$this->processor_model->set_ffmpeg_video_status($queue['video_id'], 'process1_done');
			}
		}
		if(isset($_GET['test'])){
			echo json_encode($status);
			die;
		}
	}
	
	function check_readytoprocess1(){
		$ffmpeg_instance_count = $this->processor_model->get_ffmpeg_instance_count();
		if($ffmpeg_instance_count > $GLOBALS['ffmpeg_instance_limit']){
			return;
		}
		$ffmpeg_queue = $this->processor_model->get_ffmpeg_queue(array('status'=>'queue'), ['video_id,video_slug,file_name,folder,height']);
		foreach($ffmpeg_queue as $queue){
			//if($this->is_delete($queue)){return;}
			if($ffmpeg_instance_count >= $GLOBALS['ffmpeg_instance_limit']){return;}
			$ffmpeg_instance_count++;
			$this->processor_model->set_ffmpeg_video_status($queue['video_id'], 'process1');
			$this->processor_model->make_resolution($queue);
		}
	}
	
	
	
}
