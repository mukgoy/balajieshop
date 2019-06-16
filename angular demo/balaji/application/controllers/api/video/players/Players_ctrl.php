<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Players_ctrl extends CI_Controller {
	
	function __construct(){ 
	    parent::__construct();
		$this->load->model("video/players/video_model");
	}

	public function embed($video_id){
		$select = "video_id,business_id,player_theme_id,url,title,thumbnail";
		$video_info = $this->video_model->get_video_info(array('video_id'=>$video_id), $select);
		if(!$video_info){
			die("no video found");
		}
		else{
			$video_info['type'] = 'mpd';
			if(isset($_GET['theme_id'])){
				$video_info['player_theme_id'] = $_GET['theme_id'];
			}
			
			$player_theme = $this->get_player_theme($video_info['player_theme_id'], $video_info['business_id']);
			$video_info['player_theme_id'] = $player_theme['player_theme_id'];
			
			if(isset($_GET['playerskin'])){
				$player_theme['playerskin'] = $_GET['playerskin'];
			}
			if(isset($_GET['autoplay'])){
				$player_theme['start_event'] = 'autoplay';
			}
	

			$output['video_info']	= $video_info;
			$output['player_theme']	= $player_theme;
			$output['share_url']	= '';
			
			if(isset($_GET['test'])){
				echo '<pre>';
				print_r($output);
				die('app/video/players/'.$video_info['type'].'/'.$player_theme['playerskin']);
			}

			$this->load->view('app/video/players/'.$video_info['type'].'/'.$player_theme['playerskin'], $output);
		}
		
	}
	
	public function frame($video_id){
		$select = "player_frame_id";
		$video_info = $this->video_model->get_video_info(array('id'=>$video_id), $select);
		
		if(!$video_info){
			echo "no vidoe found";
		}
		else{
			if(isset($_GET['frame_id']) && $_GET['frame_id'] !=''){
				$video_info['player_frame_id'] = $_GET['frame_id'];
			}
			if($video_info['player_frame_id'] == 0){
				$this->embed($video_id);
			}else{
				$select = "slug";
				$frame_info = $this->video_model->get_frame_info(array('id'=>$video_info['player_frame_id']), $select);
				$output['assets'] = $GLOBALS['cdn_url'].'assets/players/frames/';
				$output['player_url'] = site_url().'players/players_ctrl/embed/'.$video_id;
				
				$this->load->view('players/frames/'.$frame_info['slug'], $output);
			}
		}
	}
	
	public function subtitle($video_id){
		echo $this->video_model->get_sub_title($video_id);
	}
	
	/*
	Post data {
		video_id:36
		visitor_id:1
		visitor_session_id:8
	}
	*/
	public function init_stats(){
		$this->video_model->init_stats();
	}
	
	public function update_stats(){
		$this->video_model->update_stats();
	}
	
	/* helper functions*/
	public function get_player_theme($theme_id, $business_id){ //used to just like recursive 
		$video_theme = $this->video_model->get_player_theme($theme_id);
		if(!$video_theme){
			$channel = $this->video_model->get_channel_info($business_id, 'player_theme_id');
			$video_theme = $this->video_model->get_player_theme($channel['player_theme_id']);
			if(!$video_theme){
				$video_theme = $this->video_model->get_player_theme(1);
			}
		}
		return $video_theme;
	}

	
}
