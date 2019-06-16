<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_varients_model extends CI_model {

	public function get($product_id){
		$this->db->select('*');
		$this->db->where('product_id',$product_id);
		$query=$this->db->get('product_variants');
		$output['data'] =$query->result();
		return $output;
	}

	public function set_filter(){
		if($this->input->get('search')){
			$this->db->group_start();
			$this->db->or_like('product_id', $this->input->get('search'));
			$this->db->or_like('products.title', $this->input->get('search'));
			$this->db->or_like('brands.title', $this->input->get('search'));
			$this->db->group_end();
		}
	}
	
	public function set_limit(){
		$items_per_page = $this->input->get('items_per_page')?$this->input->get('items_per_page'):10;
		$current_page = $this->input->get('current_page')?$this->input->get('current_page'):1;
		$this->db->limit($items_per_page, ($current_page-1)*$items_per_page);
		
		$order_by = $this->input->get('order_by')?$this->input->get('order_by'):'modified';
		$order = $this->input->get('order')?$this->input->get('order'):'desc';
		$this->db->order_by($order_by, $order);
	}
	
	public function add(){
		$this->upload();
		unset($_POST['error']);
		$this->db->set($_POST);
		$query=$this->db->insert('product_variants');
		return $this->db->insert_id();
	}
	
	public function update(){
		$this->upload();
		unset($_POST['error']);
		$this->db->set($_POST);
		$this->db->where('product_variant_id',$_POST['product_variant_id']);
		$this->db->update('product_variants');
		return 1;
	}
	
	public function update_status(){
		$this->db->set('status',	$_GET['status']);
		$this->db->where('product_variant_id',$_GET['product_variant_id']);
		$query=$this->db->update('product_variants');
		return 1;
	}
	
	public function upload(){
		if(isset($_FILES['variant_image'])){
			$product_title = $this->get_model->field('products','title',['product_id'=>$_POST['product_id']]);
			$config['upload_path']   = 'uploads/products/'; 
			$config['allowed_types'] = 'png|jpg|gif|jpeg';
			$ext = pathinfo($_FILES['variant_image']['name'], PATHINFO_EXTENSION);
			$config['file_name'] =$product_title.' '.$_POST['variant_title'].'.'.$ext;
			$this->load->library('upload', $config);			
			if($this->upload->do_upload('variant_image')){
				$file_data= $this->upload->data();
				$_POST['image'] = $config['upload_path'].$file_data['file_name'];
			}
			else{
				$this->upload->display_errors();
			}
		}
	}
}
