<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Cart_model extends CI_Model{
	
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
	
	public function getcart($order_id){
		$this->db->select('order_product_id,order_id,order_products.product_id,order_products.product_variant_id,qty');
		$this->db->select('products.title as product_title,variant_title,image,discount_title,brands.title as brand_title');
		$this->db->select('product_variants.sell_price as sell_price,product_variants.mrp as mrp');
		$this->db->join('product_variants','product_variants.product_variant_id=order_products.product_variant_id', 'left');
		$this->db->join('products','products.product_id=order_products.product_id', 'left');
		$this->db->join('brands','brands.brand_id=products.brand_id', 'left');
		$this->db->where('order_id', $order_id);
		$query=$this->db->get('order_products');
		return $query->result_array();
	}
	
	public function addtocart(){
		$user_id = $this->input->post('user_id');
		$order_id = $this->get_model->field('orders', 'order_id', ['user_id'=>$user_id, 'order_status'=>0]);
		if(!$order_id){
			$userdata = $this->get_model->row('users','*',['user_id'=>$user_id]);
			$this->db->set('user_id', $this->input->post('user_id'));
			$this->db->set('email', $userdata['email']);
			$this->db->set('mobile', $userdata['mobile']);
			$this->db->set('fullname', $userdata['fullname']);
			$this->db->set('address', $userdata['address']);
			$this->db->set('area_id', $userdata['area_id']);
			$this->db->set('pincode', $userdata['pincode']);
			$this->db->set('city', $userdata['city']);
			$this->db->insert('orders');
			$order_id = $this->db->insert_id();
		}
		
		$product_variant_id = $this->input->post('product_variant_id');
		$product_id = $this->get_model->field('product_variants', 'product_id', ['product_variant_id'=>$product_variant_id]);
		if($product_id){
			$userdata = $this->get_model->row('users','*',['user_id'=>$user_id]);
			$this->db->set('order_id', $order_id);
			$this->db->set('product_id', $product_id);
			$this->db->set('product_variant_id', $product_variant_id);
			$this->db->set('qty', 1);
			$this->db->insert('order_products');
			return $order_id;
		}else{
			die("this variant not exist");
		}
	}
	
	public function update_cart_quantity(){
		$user_id = $this->input->post('user_id');
		$order_product_id = $this->input->post('order_product_id');
		$qty = $this->input->post('qty');
		$order_id = $this->get_model->field('orders', 'order_id', ['user_id'=>$user_id, 'order_status'=>0]);
		
		if($qty){
			$this->db->set('qty', $qty);
			$this->db->where('order_product_id', $order_product_id);
			$this->db->where('order_id', $order_id);
			$this->db->update('order_products');
		}else{
			$this->db->where('order_product_id', $order_product_id);
			$this->db->where('order_id', $order_id);
			$this->db->delete('order_products');
		}
		return $order_id;
	}
	
	
}
