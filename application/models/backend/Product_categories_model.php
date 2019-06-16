<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_categories_model extends CI_model {

	function get(){
		$this->db->select('product_id,products.title, popularity,status,modified');
		$this->db->select('products.brand_id, brands.title as brand');
		$this->db->select('products.cat1_id, categories1.title as cat1');
		$this->db->select('products.cat2_id, categories2.title as cat2');
		$this->db->select('products.cat3_id, categories3.title as cat3');
		$this->db->join('brands', 'products.brand_id = brands.brand_id', 'left');
		$this->db->join('categories1', 'products.cat1_id = categories1.cat1_id', 'left');
		$this->db->join('categories2', 'products.cat2_id = categories2.cat2_id', 'left');
		$this->db->join('categories3', 'products.cat3_id = categories3.cat3_id', 'left');
		$this->set_filter();
		$this->set_limit();
			
		$query=$this->db->get('products');
		$output['data'] =$query->result();
		
		//used to filter_row_count
		$this->db->select('count(product_id) as nums');
		$this->db->join('brands', 'products.brand_id = brands.brand_id', 'left');
		$this->db->join('categories1', 'products.cat1_id = categories1.cat1_id', 'left');
		$this->db->join('categories2', 'products.cat2_id = categories2.cat2_id', 'left');
		$this->db->join('categories3', 'products.cat3_id = categories3.cat3_id', 'left');
		$this->set_filter();
		$query=$this->db->get('products');
		$output['total_items'] = $query->row()->nums;
		return $output;
	}

	function set_filter(){
		if($this->input->get('search')){
			$this->db->group_start();
			$this->db->or_like('product_id', $this->input->get('search'));
			$this->db->or_like('products.title', $this->input->get('search'));
			$this->db->or_like('brands.title', $this->input->get('search'));
			$this->db->or_like('categories1.title', $this->input->get('search'));
			$this->db->or_like('categories2.title', $this->input->get('search'));
			$this->db->or_like('categories3.title', $this->input->get('search'));
			$this->db->group_end();
		}
	}
	
	function set_limit(){
		$items_per_page = $this->input->get('items_per_page')?$this->input->get('items_per_page'):10;
		$current_page = $this->input->get('current_page')?$this->input->get('current_page'):1;
		$this->db->limit($items_per_page, ($current_page-1)*$items_per_page);
		
		$order_by = $this->input->get('order_by')?$this->input->get('order_by'):'modified';
		$order = $this->input->get('order')?$this->input->get('order'):'desc';
		$this->db->order_by($order_by, $order);
	}
	
	public function add(){
		$this->db->set($_POST);
		$query=$this->db->insert('products');
		return $this->db->insert_id();
	}
	
	public function update(){
		$this->db->set('title',$_POST['title']);
		$this->db->set('brand_id',$_POST['brand_id']);
		$this->db->set('cat1_id',$_POST['cat1_id']);
		$this->db->set('cat2_id',$_POST['cat2_id']);
		$this->db->set('cat3_id',$_POST['cat3_id']);
		$this->db->set('popularity',$_POST['popularity']);
		$this->db->set('status',	$_POST['status']);
		$this->db->where('product_id',$_POST['product_id']);
		$this->db->update('products');
		return 1;
	}
	
	public function update_status(){
		$this->db->set('status',	$_GET['status']);
		$this->db->where('product_id',$_GET['product_id']);
		$query=$this->db->update('products');
		return 1;
	}
	
}
