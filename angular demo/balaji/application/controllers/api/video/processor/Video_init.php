<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Video_init extends CI_Controller {
	
	function __construct(){ 
	    parent::__construct();	
		$this->load->model("video/processor/video_model");		
	}
	
	function index(){
		$this->set_globals();
		$this->set_video_stats();
		$this->make_thumb();
		$this->insert_ffmpeg_queue();
	}
	function set_globals(){
		$GLOBALS['video'] = $this->video_model->get_video($_GET['video_id'], 'business_id,video_id,slug_smart,url,video_extention,thumbnail');
		$GLOBALS['basefolder_root'] = $_SERVER['DOCUMENT_ROOT'].'/'.config_item('base_path');
		$GLOBALS['tempfolder_root']	 = $GLOBALS['basefolder_root'].'uploads/temp/';
		$GLOBALS['videofolder_root'] = $GLOBALS['tempfolder_root'].$GLOBALS['video']['slug_smart'].'/';
		$GLOBALS['tempfolder_url'] 	 = config_item('base_url').'uploads/temp/';
		$GLOBALS['videofolder_url']	 = $GLOBALS['tempfolder_url'].$GLOBALS['video']['slug_smart'].'/';
		$GLOBALS['video_path']		 = $GLOBALS['video']['url'];
		$GLOBALS['video_filename']		 = $GLOBALS['video']['slug_smart'].'.'.$GLOBALS['video']['video_extention'];
	}
	
	function set_video_stats(){
		$GLOBALS['video_stats'] 		= $this->get_probe_info();
		$GLOBALS['video_stats']['size'] = filesize($GLOBALS['video_path']);
		$this->video_model->update_video_stats($_GET['video_id'], $GLOBALS['video_stats']);
	}
	function get_probe_info(){
		$ffprobe = config_item('ffprobe');
		$command = $ffprobe.' -v error -show_entries stream=width,height,duration -of default=noprint_wrappers=1 '.config_item('base_url').$GLOBALS['video_path'];
		$output = trim(shell_exec($command));
		$lines = explode("\n", $output);
		$result = array();
		foreach($lines as $line){
			$out = explode("=", $line);
			if(!isset($result[$out[0]]))
				$result[$out[0]] = $out[1];
		}
		return $result;
	}
	
	function make_thumb(){
		$source_file = config_item('base_url').$GLOBALS['video_path'];
		$destination_file = $GLOBALS['videofolder_root'].$GLOBALS['video']['thumbnail'];
		$video_pointer=1;
		$dimention = "320x180";
		$ffmpeg = config_item('ffmpeg');
		$inserttext = '> '. str_replace('.png', '_thumb.txt', $destination_file).' 2>&1 &';
		$inserttext = '';
		$cmd = "$ffmpeg -i $source_file -an -ss $video_pointer -s $dimention $destination_file $inserttext";
		shell_exec($cmd);
	}
	
	function insert_ffmpeg_queue(){
		$ffmpeg_queue = array(
			'business_id' 		=> $GLOBALS['video']['business_id'],
			'video_id' 			=> $GLOBALS['video']['video_id'],
			'video_slug' 		=> $GLOBALS['video']['slug_smart'],
			'file_name' 		=> $GLOBALS['video_filename'],	
			'video_extention' 	=> $GLOBALS['video']['video_extention'],
			'folder' 			=> 'uploads/temp/'.$GLOBALS['video']['slug_smart'].'/',
			'height' 			=> $GLOBALS['video_stats']['height'],
		);
		$this->db->insert('video_ffmpeg_queue',$ffmpeg_queue);
		$GLOBALS['video']['video_slug'] = $GLOBALS['video']['slug_smart'];
		$GLOBALS['video']['thumb_url'] = $GLOBALS['videofolder_url'].$GLOBALS['video']['thumbnail'];
		echo json_encode($GLOBALS['video']);
	}
	
	
	
}
