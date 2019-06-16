<?php
defined('BASEPATH') OR exit('No direct script access allowed');
include("Apps.php");
class Library extends Apps {
	public function __construct(){
		parent::__construct();
		$this->load->model('smart/library_model');
		$this->load->helper('smart/cdn_url_helper');
		$GLOBALS['business_id']	= 1;
		$GLOBALS['user_id']	= 1;
		$GLOBALS['share_url'] = 'http://localhost/SagSmart-v1.0/api/smart/Library/open_link/';
		//$this->config->item('cdn_url');
		
		
	}
	
	public function index(){
		$draw  =  $this->input->post('draw') ? $this->input->post('draw') : 1;
		$search = $this->input->post('search') ? $this->input->post('search') : '';
		$limit =  $this->input->post('items_per_page') ? $this->input->post('items_per_page') : '0';
		$current_page =  $this->input->post('current_page') ? $this->input->post('current_page') : 1;
		$order_by =  $this->input->post('order_by') ? $this->input->post('order_by') : 'ASC';
		$order_type =  $this->input->post('order_type') ? $this->input->post('order_type') : 'file_name';
		$type =  $this->input->post('type') ? $this->input->post('type') : '';
		$folder_id =  $this->input->post('folder_id') ? $this->input->post('folder_id') : '';

		$date_start =  $this->input->post('date_start') ? $this->input->post('date_start') : '';
		$date_end =  $this->input->post('date_end') ? $this->input->post('date_end') : '';
		$gate =  $this->input->post('gate') ? $this->input->post('gate') : 'AND';
		$modified_date_start =  $this->input->post('modified_date_start') ? $this->input->post('modified_date_start') : '';
		$modified_date_end =  $this->input->post('modified_date_end') ? $this->input->post('modified_date_end') : '';


		$this->load->model('smart/Status_model');
		$file_types = $this->Status_model->get_status('file_type');
		$file_type= '';
		foreach($file_types as $val){
			if($val['option_value'] == strtolower($type)){
				$file_type=$val['option_key'];
				$folder_id = 0;
			}
		}
		if($type=='folder'){
			if(trim($folder_id)==''){$folder_id=0;}
		}


		$data = array(
			'business_id'=>$GLOBALS['business_id'],
			'search'=>$search,
			'current_page'=>$current_page,
			'limit'=>$limit,
			'order_by'=>$order_by,
			'order_type'=>$order_type,
			'type'=>$type,
			'file_type'=>$file_type,
			'folder_id'=>$folder_id,
			'date_start'=>$date_start,
			'date_end'=>$date_end,
			'gate'=>$gate,
			'modified_date_start'=>$modified_date_start,
			'modified_date_end'=>$modified_date_end
		);

		// get all records and total number of records
		$counts 	= $this->library_model->get_count($data);
		$records 	= $this->library_model->get($data);
		foreach($records as $key=>$record){
			if(in_array($record['file_type'], array('image','video'))){
				$records[$key]['thumbnail'] = get_library_path($GLOBALS['business_id']).'2085X140/'.$record['thumbnail'];
			}	
		}


		$draw++;
		$output = array(
					"counts"	=>	$counts,
					"records"		=>	$records,
					"draw"			=>	$draw,
				);
    
		$response 	= array('message'=>$output,'callback'=>'','redirect_type'=>'angular','redirect_url'=>'');
	    $response['status'] = 'success';
		echo $this->jsonify($response);
	}


	public function add_folder(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_002'),"Folder"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('title','Title','trim|required');
		if($this->form_validation->run()){
			$data = array(
				'title'			=>	$this->input->post('title'),
				'business_id'	=>	$GLOBALS['business_id'],
				'status' 		=> 	'1',
				'created_by'	=>	$GLOBALS['user_id'],
				'created_date'	=>	time(), 
				'modified_date'	=>	time(),
				'modified_by'	=>	$GLOBALS['user_id'],
			);
			$exist  = $this->library_model->check_folder_exist($data['title'],$data['business_id'],0);
			if(!$exist){
				$output = $this->library_model->add_folder($data);
				if($output['success']== 1){
					$data = array('library_object_id'=>0,'library_folder_id'=>$output['id']);
					$this->create_share_link($data);
					$response['status'] 	= 'success';
					$response['message'] 	= replaceSingleTag($this->lang->line('msg_suc_002'),"Folder");
					$response['insert_id'] 	= $output['id'];
				}
			}else{
				$response['message'] 	= replaceSingleTag($this->lang->line('msg_err_005'),"Folder");
			}
		}else{
			$error['title'] 	 = form_error('title');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}

	public function rename_folder(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_001'),"Folder"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('title','Title','trim|required');
		$this->form_validation->set_rules('folder_id','Folder Id','trim|required');
		if($this->form_validation->run()){
			$data = array(
				'title'			=>	$this->input->post('title'),
				'modified_date'	=>	time(),
				'modified_by'	=>	$GLOBALS['user_id'],
			);
			$condition = array(
				'library_folder_id'	=>	$this->input->post('folder_id'),
				'business_id'	=>	$GLOBALS['business_id']
			);
			
			$exist  = $this->library_model->check_folder_exist($data['title'],$condition['business_id'],$condition['library_folder_id']);
			if(!$exist){
				$output = $this->library_model->update_folder($condition, $data);
				if($output){
					$response['status'] 	= 'success';
					$response['message'] 	= replaceSingleTag($this->lang->line('msg_suc_001'),"Folder");
				}
			}else{	
				$response['message'] 	= replaceSingleTag($this->lang->line('msg_err_005'),"Folder");
			}
		}else{
			$response['status']  = 'error';
			$error['title'] 	 = form_error('title');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}

	public function get_all_folders(){
		$response = array('status'=>'success','message'=>'','callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$data = array(
						'business_id'=>$GLOBALS['business_id'],
						'status'=>1
					);
		$folders  = $this->library_model->get_all_folders($data);
		$output = array(
					"total_record"	=>	count($folders),
					"records"		=>	$folders,
					"draw"			=>	1,
				);
		$response['message'] = $output;
		echo $this->jsonify($response);
	}
	
	public function upload_object(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"File"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'');
		$this->form_validation->set_rules('folder_id','Select Folder','trim|required');
		$uploaded_file = $_FILES['file'];
		if (empty($uploaded_file['name'])){
			$this->form_validation->set_rules('file','File','required');
		}
		if($this->form_validation->run()){
			$this->load->helper('smart/upload_helper');
			$config['upload_path']   = './uploads/temp/'; 
			$config['allowed_types'] = 'jpg|jpeg|png|gif|ico|3gp|avi|flv|m4v|mkv|mov|mp4|mpg|mpeg|wmv|webm|doc|docx|xls|xlsx||ppt|pptx|zip|rar|txt|pdf|wpd|mp3|wav|ogg|mpa|mid|midi|cda|aif'; 
			$new_filename = time().str_replace(' ','-',$uploaded_file['name']);
			$config['file_name'] = $new_filename;
			$this->load->library('upload', $config);
			$folder_id = $this->input->post('folder_id');
			if($this->upload->do_upload('file')){
				$data = $this->upload->data();
				$file_ext_data = $this->get_file_type_status($data); 
				$file_ext = $file_ext_data['type'];
				$file_ext_status = $file_ext_data['status'];
				$insert = array(
								'business_id'=>$GLOBALS['business_id'],
								'library_folder_id'=>$folder_id,
								'file'=>$data['file_name'],
								'file_name'=>str_replace($data['file_ext'],'',$data['client_name']),
								'file_alt_name'=>str_replace($data['file_ext'],'',$data['client_name']),
								'file_type'=>$file_ext_status,
								'file_extension'=>strtolower(str_replace('.','',$data['file_ext'])),
								'duration'=>0,
								'size'=>$uploaded_file['size'],
								'status'=>1,
								'privacy_status'=>0,
								'created_by'=>$GLOBALS['user_id'],
								'created_date'=>time(),
								'modified_by'=>$GLOBALS['user_id'],
								'modified_date'=>time()
							);
				$s3_upload_file_array = array();
				$source_path = $data['full_path'];
				$target_path = './uploads/temp/';
				if($file_ext == 'image'){
					$s3_upload_file_array[] = array('source'=>$source_path,'destination'=>get_library_path($GLOBALS['business_id']).$data['orig_name']);
					$image_sizes = array('205'=>'140','565'=>'377');
					$this->load->library('image_lib');
					foreach ($image_sizes as $width=>$height) {
						$config = array(
							'source_image' => $source_path,
							'new_image' => $target_path,
							'maintain_ration' => true,
							'create_thumb' => TRUE,
							'thumb_marker' => '_thumb'.$width,
							'width' => $width,
							'height' => $height
						);
						$this->image_lib->initialize($config);
						if($this->image_lib->resize()){
							$thumbnail = str_replace('\\','/',$this->image_lib->full_dst_path);
							$s3_upload_file_array[] = array('source'=>$thumbnail,'destination'=>get_library_path($GLOBALS['business_id']).$width.'X'.$height.'/'.$data['orig_name']);
						}
						$this->image_lib->clear();
					}
				}
				else if($file_ext == 'video'){
					$this->load->helper('smart/ffmpeg_helper');
					$s3_upload_file_array[] = array('source'=>$source_path,'destination'=>get_library_path($GLOBALS['business_id']).$data['orig_name']);
					$insert['duration'] = get_video_duration($source_path);
					$video_sizes = array('205'=>'140','565'=>'377');
					foreach ($video_sizes as $width=>$height) {
						$thumbnail_path = $data['file_path'].$data['raw_name'].'_thumb'.$width.'.png';
						$res = create_video_thumbnail($source_path,$thumbnail_path,$width.'X'.$height,1);
						if($res){
							$s3_upload_file_array[] = array('source'=>$thumbnail_path,'destination'=>get_library_path($GLOBALS['business_id']).$width.'X'.$height.'/'.$data['raw_name'].'.png');
						}
					}
				}
				else if($file_ext == 'pdf'){
					$s3_upload_file_array[] = array('source'=>$source_path,'destination'=>get_library_path($GLOBALS['business_id']).$data['orig_name']);
				}
				else if($file_ext == 'document'){
					$this->load->helper('smart/office_converter_helper');
					$res = convert_to_pdf($source_path,$data['file_path']);
					if($res){
						$source = $data['file_path'].$data['raw_name'].'.pdf';
						$s3_upload_file_array[] = array('source'=>$source,'destination'=>get_library_path($GLOBALS['business_id']).$data['raw_name'].'.pdf');
					}
					$insert['title'] = $data['raw_name'].'.pdf';
				}
				else{}
				$complete_flag = true;
				foreach($s3_upload_file_array as $file){
					$res = upload_file($file['source'], $file['destination']);
					if(!$res['status']){ $complete_flag = false; }
				}
				
				if($complete_flag){
					$output = $this->library_model->add_object($insert);
					if($output['success']== 1){
						$data = array('library_object_id'=>$output['id'],'library_folder_id'=>$insert['library_folder_id']);
						$this->create_share_link($data);
						$response['status'] 	= 'success';
						$response['message'] 	= replaceSingleTag($this->lang->line('msg_suc_009'),"File");
						$response['insert_id'] 	= $output['id'];
					}
				}
			}
			else{
				$response['message'] = replaceSingleTag($this->lang->line('msg_err_008'),"File");
			}
		}else{
			$error['file'] 	= form_error('file');
			$response['message'] = $error;
		}
		
		echo $this->jsonify($response);
	}
	
	public function get_file_type_status($data){
		$file_type = explode('/',$data['file_type'])[0];
		if($file_type == 'application'){
			$document_ext = array('.doc','.docx','.xls','.xlsx','.ppt','.pptx') ;
			if(in_array(strtolower($data['file_ext']), $document_ext)){
				$file_type = 'document';
			}
			else if(strtolower($data['file_ext']) == '.pdf'){
				$file_type = 'pdf';
			}else{
				$file_type = 'other';
			}
		}
		if($file_type == 'image'){$file_type_status =1;}
		else if($file_type == 'video'){$file_type_status =2;}
		else if($file_type == 'document' || $file_type == 'pdf'){$file_type_status =3;}
		else if($file_type == 'audio'){$file_type_status =4;}
		else{$file_type_status = 0;}
		return array('type'=>$file_type,'status'=>$file_type_status);
	}
	
	public function move_object(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"File Move"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('object_id','Files','trim|required');
		$this->form_validation->set_rules('folder_id','Folder','trim|required');
		if($this->form_validation->run()){
			$folder_id = $this->input->post('folder_id');
			$object_id = $this->input->post('object_id');
			$object_id = explode(',',$object_id);
			$condition = array('business_id'=>$GLOBALS['business_id'],'library_folder_id'=>$folder_id);
			if($this->library_model->chk_folder_exist($condition) || $folder_id=='0'){
				$responce_flag = $this->library_model->move_object($folder_id, $GLOBALS['business_id'] ,$object_id);
				if($responce_flag){
					$response['status'] = 'success';
					$response['message'] = replaceSingleTag($this->lang->line('msg_suc_006'),"Files Move");
				}
			}
			else{
				$response['message'] = replaceSingleTag($this->lang->line('msg_err_006'),"Folder");
			}
				
		}else{
			$error['object_id'] 	 = form_error('object_id');
			$error['folder_id'] 	 = form_error('folder_id');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}

	public function copy_object(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"File Copy"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('object_id','Files','trim|required');
		$this->form_validation->set_rules('folder_id','Folder','trim|required');
		if($this->form_validation->run()){
			$folder_id = $this->input->post('folder_id');
			$object_id = $this->input->post('object_id');
			$object_id = explode(',',$object_id);
			$condition = array('business_id'=>$GLOBALS['business_id'],'library_folder_id'=>$folder_id);
			if($this->library_model->chk_folder_exist($condition) || $folder_id=='0'){
				$this->load->library('amazons3');
				$this->load->helper('string');
				foreach($object_id as $id){
					$res = $this->library_model->get_object($id);
					if($res['success']){
						$source_file = get_library_path($GLOBALS['business_id']).$res['data']['title'];
						$tmp_array = explode('.',$res['data']['title']);
						$tmp_ext = $tmp_array[count($tmp_array)-1];
						array_pop($tmp_array);
						$tmp_filename = implode('.',$tmp_array);
						$new_filename = time().random_string('alnum',10);
						$new_file_fullname = $new_filename.'.'.$tmp_ext;
						$destination_file = get_library_path($GLOBALS['business_id']).$new_file_fullname;
						$is_upload = $this->amazons3->copyAWS($source_file, $destination_file);
						if($res['data']['file_type'] == 1 || $res['data']['file_type']){
							$exist_sizes = array('205'=>'140','565'=>'377');
							foreach ($exist_sizes as $width=>$height) {
								if($res['data']['file_type'] == 1){
									$source_filename = $res['data']['title'];
									$destination_filename = $new_file_fullname;
								}else{
									$source_filename = $tmp_filename.'.png';
									$destination_filename = $new_filename.'.png';
								}
								$source_file = get_library_path($GLOBALS['business_id']).$width.'X'.$height.'/'.$source_filename;
								$destination_file = get_library_path($GLOBALS['business_id']).$width.'X'.$height.'/'.$destination_filename;
								$this->amazons3->copyAWS($source_file, $destination_file);
							}
						}
						if($is_upload){
							$insert = $res['data'];
							unset($insert['library_object_id']);
							$insert['created_by'] =  $GLOBALS['user_id'];
							$insert['created_date'] = time();
							$insert['modified_by'] = $GLOBALS['user_id'];
							$insert['modified_date'] = time();
							$insert['file'] = $new_file_fullname;
							$output = $this->library_model->add_object($insert);
							if($output['success']== 1){
								$response['status'] 	= 'success';
								$response['message'] 	= replaceSingleTag($this->lang->line('msg_suc_006'),"File Copy");
							}
						}
					}
				}
			}
			else{
				$response['message'] = replaceSingleTag($this->lang->line('msg_err_007'),"Folder");
			}
				
		}else{
			$error['object_id'] 	 = form_error('object_id');
			$error['folder_id'] 	 = form_error('folder_id');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}

	public function update_privacy(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_000'),"File"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('type','Type','trim|required');
		if($this->input->post('type')=='folder'){
			$this->form_validation->set_rules('id','Folder','trim|required');
		}else{
			$this->form_validation->set_rules('id','File','trim|required');
		}
		$this->form_validation->set_rules('privacy_status','Privacy','trim|required');
		if($this->input->post('privacy_status')){
			if($this->input->post('privacy_status') == '2'){
				$this->form_validation->set_rules('password','Password','trim|required');
			}
		}
		if($this->form_validation->run()){
			
			$privacy_status = $this->input->post('privacy_status');
			$id = $this->input->post('id');
			$password = '';
			if($this->input->post('password')){$password = trim($this->input->post('password'));}
			if($this->input->post('type')=='folder'){
				$condition = array('business_id'=>$GLOBALS['business_id'],'library_folder_id'=>$id);
				$data = array('privacy_status'=>$privacy_status,'password'=>$password);
				$responce_flag = $this->library_model->update_folder($condition,$data);
			}else{
				$condition = array('business_id'=>$GLOBALS['business_id'],'library_object_id'=>$id);
				$data = array('privacy_status'=>$privacy_status,'password'=>$password);
				$responce_flag = $this->library_model->update_object($condition,$data);
			}
			
			if($responce_flag){
				$response['status'] = 'success';
				$response['message'] = replaceSingleTag($this->lang->line('msg_suc_001'),"Files Privacy");
			}
		}else{
			$error['id'] 	 = form_error('id');
			$error['type'] 	 = form_error('type');
			$error['privacy_status'] 	 = form_error('privacy_status');
			$error['password'] 	 = form_error('password');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}

	public function get_share_link(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_000'),"File"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('id','Object','trim|required');
		$this->form_validation->set_rules('type','Type','trim|required');
		if($this->form_validation->run()){
			$type = $this->input->post('type');
			$id = $this->input->post('id');
			if($type == 'folder'){
				$object_id = 0;
				$folder_id = $id;
				$object_responce = $this->library_model->get_folder($folder_id);
			}else{
				$object_id = $id;
				$folder_id = 0;
				$object_responce = $this->library_model->get_object($object_id);
			}
			
			$data = array('library_object_id'=>$object_id,'library_folder_id'=>$folder_id);
			if($object_responce['success']){
				if(!$this->library_model->chk_share_link_exist($data)){
					$this->create_share_link($data);
				}
				$output = $this->library_model->get_share_link($data);
				if($output['success']){
					$response['status'] = 'success';
					$output['data']['url'] = $GLOBALS['share_url'].$output['data']['slug']; 
					$response['message'] = $output['data'];
				}
			}
			else{
				$response['message'] = replaceSingleTag($this->lang->line('msg_err_006'),"File");
			}
		}else{
			$error['id'] 	 = form_error('id');
			$error['type'] 	 = form_error('type');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}
	
	public function create_share_link($data){
		$insert = array(
						'business_id'=>$GLOBALS['business_id'],
						'library_folder_id'=>$data['library_folder_id'],
						'library_object_id'=>$data['library_object_id'],
						'slug'=>$this->library_model->generate_unique_link(),
						'expired'=>'',
						'status'=>1,
						'created_date'=>time(),
						'created_by'=>$GLOBALS['business_id'],
						'modified_date'=>time(),
						'modified_by'=>$GLOBALS['business_id']
					);
		return $this->library_model->create_share_link($insert);
	}
	
	public function link_share(){
		$response = array('status'=>'error','message'=>replaceSingleTag($this->lang->line('msg_err_004'),"Link Share"),'callback' => '','redirect_type'=>'angular','redirect_url'=>'','insert_id'=>'');
		$this->form_validation->set_rules('link_id','Link','trim|required');
		$this->form_validation->set_rules('expired','Expiry Date','trim|required');
		$this->form_validation->set_rules('email','Email','trim|required');
		if($this->form_validation->run()){
			$message = '';
			if($this->input->post('mesage')){$message = $this->input->post('mesage');}
			$link_data = array(
								'expired' => $this->input->post('expired'),
								'modified_by'	=>	$GLOBALS['user_id'],
								'modified_by'	=>	time()
							);
			$link_condition = array(
									'business_id'	=>	$GLOBALS['business_id'],
									'library_share_link_id'	=>	$this->input->post('link_id')
								);
			$this->library_model->update_share_link($link_condition,$link_data);
			$emails = $this->input->post('email');
			foreach($emails as $email){
				$insert = array(
							'link_share_link_id' =>	$this->input->post('title'),
							'business_id'	=>	$GLOBALS['business_id'],
							'email'	=>	$email,
							'message'	=>	$message,
							'status' 		=> 	'1',
							'created_by'	=>	$GLOBALS['user_id'],
							'created_date'	=>	time(), 
							'modified_date'	=>	time(),
							'modified_by'	=>	$GLOBALS['user_id']
						);
				$this->library_model->insert_share_user($insert);
			}
			$response['status'] = 'success';
			$response['message'] = replaceSingleTag($this->lang->line('msg_suc_006'),"Link Share");
			
		}else{
			$error['title'] 	 = form_error('title');
			$response['message'] = $error;
		}
		echo $this->jsonify($response);
	}
	
	//Without Authentication use 
	public function open_link($slug){
		$condition = array(
			'slug'=>$slug,
			'status'=>1
		);
		$responce = $this->library_model->get_share_link($condition);
		if($responce['success']){
			$link_data = $responce['data']; 
			if($link_data['expired'] > time() || $link_data['expired'] == 0){
				if($link_data['library_folder_id']){
					$folder =  $this->library_model->get_folder($link_data['library_folder_id']);
					if($folder['success']){
						$files = $this->library_model->get_all_file_by_filder($link_data['library_folder_id']);
						foreach($files as $key=>$val){
							$files[$key]['url'] = $GLOBALS['share_url'].$val['slug'];
						}
						echo json_encode($files);
						
					}else{
						echo 'link Not Exist'; 
					}

				}else{
					$object =  $this->library_model->get_object($link_data['library_object_id']);
					if($object['success']){
						$url =  $this->config->item('cdn_url').get_library_path($GLOBALS['business_id']).$object['data']['file'];
						header('Content-Type: *');
						echo get_html($url);
					}else{
						echo 'link Not Exist'; 
					}
				}
			}else{
				echo 'link Expired';
			}
		
		}else{
			echo 'link Not Exist'; 
		}
		
	}
}
