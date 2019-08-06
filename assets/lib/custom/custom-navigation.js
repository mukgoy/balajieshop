(function($) {
	"use strict";
	$(document).on('click', ".search-box-open", function(e){
		e.stopPropagation();
		$(".canvas-box").fadeOut();
		$(".search-box").fadeIn();
	});
	$(document).on('click', ".filter-box-open", function(e){
		e.stopPropagation();
		$(".canvas-box").fadeOut();
		$(".filter-box").fadeIn();
	});
	$(document).on('click', ".sort-box-open", function(e){
		e.stopPropagation();
		$(".canvas-box").fadeOut();
		$(".sort-box").fadeIn();
	});
	$(document).on('click', ".login-box-open", function(e){
		e.stopPropagation();
		loginBoxOpen();
	});

	$(document).on('click', ".register-box-open", function(e){
		e.stopPropagation();
		registerBoxOpen();
	});
	
	$(document).on('click', ".main-box-open", function(e){
		e.stopPropagation();
		$(".canvas-box").fadeOut();
		$(".main-box").fadeIn();
	});
		
	$(document).on('click', "#fullscr-open", function(e){
		e.stopPropagation();
		$("#fullscr-nav").toggleClass('to-top-toggle')
	});
	$(document).on('click', "#fullscr-close", function(e){
		e.stopPropagation();
		$("#fullscr-nav").toggleClass('to-top-toggle')
	});
	$(document).on('click', "#sidenav-open", function(e){
		e.stopPropagation();
		$(".sidenav").toggleClass('to-left-toggle')
		$(".overlay-black").css('visibility', 'visible')
	});
	$(document).on('click', "#sidenav-close", function(e){
		e.stopPropagation();
		$(".sidenav").toggleClass('to-left-toggle')
		$(".overlay-black").css('visibility', 'hidden')
	});
	$(document).on('click', "#shc-side-open", function(e){
		e.stopPropagation();
		$("#shopping-cart-sidebar").toggleClass('to-right-toggle');
		$(".overlay-black").css('visibility', 'visible');
	});
	$(document).on('click', "#usr-side-open", function(e){
		e.stopPropagation();
		$("#user-profile-sidebar").toggleClass('to-right-toggle')
		$(".overlay-black").css('visibility', 'visible')
	});
	$(document).on('click', ".canvas", function(e){
	  if ($(".sidenav").hasClass('to-left-toggle')) {
		$(".sidenav").toggleClass('to-left-toggle')
		$(".overlay-black").css('visibility', 'hidden')
	  }
	  
	  else if ($("#shopping-cart-sidebar").hasClass('to-right-toggle')) {
		$("#shopping-cart-sidebar").toggleClass('to-right-toggle')
		$(".overlay-black").css('visibility', 'hidden')
	  }
	  
	  else if ($("#user-profile-sidebar").hasClass('to-right-toggle')) {
		$("#user-profile-sidebar").toggleClass('to-right-toggle')
		$(".overlay-black").css('visibility', 'hidden')
	  }
	})

})(jQuery);

function loginBoxOpen(){
	$(".main-view").fadeOut();
	$("#footer").fadeOut();
	
	if ($("#user-profile-sidebar").hasClass('to-right-toggle')) {
		$("#user-profile-sidebar").toggleClass('to-right-toggle')
		$(".overlay-black").css('visibility', 'hidden')
	}
	
	$(".register-box").fadeOut()
	$(".login-box").fadeIn();
}

function registerBoxOpen(){
	$(".main-view").fadeOut();
	$("#footer").fadeOut();
	
	if ($("#user-profile-sidebar").hasClass('to-right-toggle')) {
		$("#user-profile-sidebar").toggleClass('to-right-toggle')
		$(".overlay-black").css('visibility', 'hidden')
	}
	
	$(".login-box").fadeOut();
	$(".register-box").fadeIn();
}
