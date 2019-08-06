<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Product_model extends CI_Model{
	
	public function get(){
		$cat_type = $this->input->get('cat_type');
		$cat_slug = $this->input->get('cat_slug');
		$category_id = $this->get_category_id($cat_type, $cat_slug);
		$this->db->select('concat("[",group_concat(json_object(
			"product_variant_id",product_variant_id,
			"variant_title",variant_title,
			"image",image,
			"mrp",mrp,
			"sell_price", sell_price
		)),"]") as `variants`');
		$this->db->select("product_id");
		$this->db->where("status",1);
		if($this->input->get('price_start')){
			$this->db->where('sell_price >= ', $this->input->get('price_start'));
		}
		if($this->input->get('price_end')){
			$this->db->where('sell_price <= ', $this->input->get('price_end'));
		}
		$this->db->group_by('product_id');
		$query = $this->db->get('product_variants');
		$product_variants = $this->db->last_query();
		$this->db->reset_query();

		$this->db->select("products.product_id,products.title,products.brand_id,brands.title as brand_title, popularity, variants");
		$this->db->join("($product_variants) as pv", 'pv.product_id = products.product_id', 'left');
		$this->db->join("brands", 'brands.brand_id = products.brand_id', 'left');
		$this->filters($cat_type, $cat_slug,$category_id);
		$this->db->where("status",1);
		$this->db->where("variants is not null");
		$current_page = $this->input->get('current_page') ? $this->input->get('current_page') : 1;
		$this->db->limit(20, ($current_page-1)*10);
		$query = $this->db->get('products');
		
		
		$result = $query->result_array();
		foreach($result as $key=>$val){
			$result[$key]['variants'] = json_decode($result[$key]['variants']);
		}
		return $result;
	}
	
	public function filters($cat_type, $cat_slug, $category_id){
		if($this->input->get('search_key')){
			$search_key = explode(' ',$this->input->get('search_key'));
			$order_by = [];
			$this->db->group_start();
			$this->db->or_like('products.title', implode(' ', $search_key));
			$order_by[] =  "`products`.`title` LIKE '%".implode(' ', $search_key)."%' ESCAPE '!' DESC";
			foreach($search_key as $val) {
				$this->db->or_like('products.title', $val);
				$order_by[] =  "`products`.`title` LIKE '%".$val."%' ESCAPE '!' DESC";
			}
			$this->db->group_end();
			$this->db->order_by(implode(',', $order_by));
		}
		elseif($cat_type){
			$this->db->where($this->categorylist()[$cat_type]['primary'], $category_id);
		}
		
		if($this->input->get('brands')){
			$this->db->where_in('products.brand_id', explode(',',$this->input->get('brands')));
		}
	}
	
	public function get_category_id($cat_type, $cat_slug){
		if(!$cat_type){
			return null;
		}else{
			$this->db->select($this->categorylist()[$cat_type]['primary']);
			$this->db->where('title', $cat_slug);
			$query = $this->db->get($this->categorylist()[$cat_type]['table']);
			return $query->row_array()[$this->categorylist()[$cat_type]['primary']];
		}
	}
	
	public function search_autocomplete(){
		if($this->input->get('search_key')){
			$search_key = explode(' ',$this->input->get('search_key'));
			$query = [];
			
			while(sizeof($search_key) > 0) {
				$query[] = "SELECT product_id,title,".sizeof($search_key)." AS rating FROM products WHERE title LIKE '".implode(' ', $search_key)."%'";
				$query[] = "SELECT product_id,title,".sizeof($search_key)." AS rating FROM products WHERE title LIKE '%".implode(' ', $search_key)."%'";
				array_shift($search_key);
			}
			$query = implode(' UNION ', $query);
			
			$this->db->select('product_id, title,rating');
			$this->db->group_by('t.title');
			$this->db->limit(5);
			$query = $this->db->get('('.$query.') as t');
			// echo $this->db->last_query();
			return $query->result();
		}
	}
	
	public function categorylist(){
		return array(
			'cat1'=>array('table'=>'categories1', 'primary'=>'cat1_id'),
			'cat2'=>array('table'=>'categories2', 'primary'=>'cat2_id'),
			'cat3'=>array('table'=>'categories3', 'primary'=>'cat3_id'),
		);
	}
}
