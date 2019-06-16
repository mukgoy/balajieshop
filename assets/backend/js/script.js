$(document).ready(function () {

	// Stop Propagation  Dropdown Js //	  	
	$('div.dropdown-menu.stoppropagation').on('click', function (event) {
		event.stopPropagation();
	
	});
	
	// Integration Module  Stop Propagation Dropdown hide on inside cancel button //
	
	$('.cancelbutton').on('click', function(){
		$(this).closest(".dropdown-menu").removeClass("show");
		
	});
		$('.integration-box-show').on('click', function(){
		$(this).closest(".dropdown-menu").addClass("show");
	});
	
	
	// Table Filter Jquery //
	$(".filter-list-open, .filter-hide").click(function () {
		$(".t-wauto").toggleClass("tw-100");
		$(".filter-div-select").toggleClass("d-block");
		$(".col-xs-1-5").toggleClass("col-lg-1-5 col-lg-4");
		//$(".entries-hide").toggle();
	});


	// Table Checkbox Select & Show Table Option Jquery //
	$("#checkAll, #checkAll1, #checkAll2").click(function () {
		$('input:checkbox').not(this).prop('checked', this.checked);
		checkboxCheckStatus();
	});

	function checkboxCheckStatus() {
		if ($('.checkbox-active:checked').length) {
			if (!$(".table-option-manage").hasClass("d-block")) {
				$(".table-option-manage").addClass("d-block");
				$(".table-option-hide").hide();
			}
		} else {
			$(".table-option-manage").removeClass("d-block");
			$(".table-option-hide").show();
		}

		var flag = true;
		$(".checkbox-active").filter(function () {
			if (!$(this).is(':checked')) {
				flag = false;
			}
		});
		if (flag) {
			$('#checkAll, #checkAll1').prop('checked', true);
		} else {
			$('#checkAll, #checkAll1').prop('checked', false);
		}
	}

	$(".checkbox-active").click(function () {
		checkboxCheckStatus();
	});


	// Tags Input js //
	$(function () {
		if($('#primary').length){
			$('#primary').tagsInput({
				width: 'auto'
			});
		}
		if($('#secondary').length){
			$('#secondary').tagsInput({
				width: 'auto'
			});
		}
		if($('#emailtags').length){
		//	$('#emailtags').tagsInput({
		//		width: 'auto'
			//});
		}
		if($('#devices').length){
			$('#devices').tagsInput({
				width: 'auto'
			});
		}
		if($('#browsers').length){
			$('#browsers').tagsInput({
				width: 'auto'
			});
		}
		if($('#operating-systems').length){
			$('#operating-systems').tagsInput({
				width: 'auto'
			});
		}
		if($('#visitor-type').length){
			$('#visitor-type').tagsInput({
				width: 'auto'
			});
		}
		if($('#mail-to').length){
			$('#mail-to').tagsInput({
				width: 'auto'
			});
		}
		if($('#mail-cc').length){
			$('#mail-cc').tagsInput({
				width: 'auto'
			});
		}
		if($('#mail-bcc').length){
			$('#mail-bcc').tagsInput({
				width: 'auto'
			});
		}
	});

	// Toggle plus minus icon on show hide of collapse element
	$(".collapse").on('show.bs.collapse', function () {

		$(this).parent().find(".icon").removeClass("icon-add").addClass("icon-minus");

		$(this).closest(".filter-divide-bg").addClass("vl-gblue-bg mb10 filter-divide-show");
		$(".filter-scrollbar").addClass("filter-pb0");


	}).on('hide.bs.collapse', function () {

		$(this).parent().find(".icon").removeClass("icon-minus").addClass("icon-add");

		$(this).closest(".filter-divide-bg").removeClass("vl-gblue-bg mb10 filter-divide-show");
		$(".filter-scrollbar").removeClass("filter-pb0");
	});

	// Tooltip js //
	$('[data-toggle="tooltip"]').tooltip();

	// Toogle Password //
	$(".toggle-password").click(function () {
		$(".toogle-icon").toggleClass("icon-show icon-hide");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});
	
		$(".toggle-password1").click(function () {
		$(".toogle-icon1").toggleClass("icon-show icon-hide");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});
	
		$(".toggle-password2").click(function () {
		$(".toogle-icon2").toggleClass("icon-show icon-hide");
		var input = $($(this).attr("toggle"));
		if (input.attr("type") == "password") {
			input.attr("type", "text");
		} else {
			input.attr("type", "password");
		}
	});

	// Input Password Focus Show Div //
	$('.password-tooltip').hide();
	$(".password-match").on('focus', function () {
		$('.password-tooltip').show('slow');
	})
	$(".password-match").on('focusout', function () {
		$('.password-tooltip').hide('slow');
	});
	
	 

	// Stickey Header Js //
	$(window).scroll(function () {
		var sticky = $('.sticky-fix'),
			scroll = $(window).scrollTop();
		if (scroll > 0) {
			if (!$('.virtual-header').length) {
				$virtual = $('<div class="virtual-header">');
				$virtual.css({
					'width': '100%',
					'height': sticky.css('height'),
					'position': 'relative'
				});
				sticky.after($virtual);
			}
			sticky.css({
				'position': 'fixed',
				'top': '0',
				'width': '100%',
				'z-index': '99'
			});
		}
	});

			
	// Library Details Tooltip js //
 $(function(){
	var tooltip = '.library-tooltip-div';
	$('.mytooltip-hover').on('mouseover',function(e){
		
		e.preventDefault();
		
		if($(tooltip).length){
			$('body').append('<div class="library-tooltip-div"></div>');
		}
		
		$(tooltip).css({'left':e.pageX-20+'px','top':e.pageY+25+'px'});
		$(tooltip).show();
	});
	$('.mytooltip-hover').on('mouseout',function(){
		$(tooltip).hide();
	});
	$('.mytooltip-hover').on('mousemove',function(e){
		$(tooltip).css({'left':e.pageX-20+'px','top':e.pageY+25+'px'});
	});
});
	

// Library Grid View Toggle script //
	$("#lib-grid-view").click(function () {
		$(".lib-table-view-hide").removeClass("d-flex").addClass("d-none");
		$(".lib-grid-view-show").toggleClass("d-none d-block");
	
	});
	
	// Library Table View Toggle script //
		$("#lib-table-view").click(function () {
		$(".lib-table-view-hide").toggleClass("d-none");
		$(".lib-grid-view-show").toggleClass("d-block d-none");
	
	});
		// Safari browser drag and drop js //
                   var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
                   var isIE = /*@cc_on!@*/false || !!document.documentMode;
                   if(isSafari==true){
                       $('#safari_show').css("display","block");
                       $('#other_show').remove();
                   }
                   else if(isIE==true){
                       $('#safari_show').css("display","block");
                       $('#other_show').remove();
                   }
                    else {
                       $('#other_show').css("display","block");
                       $('#safari_show').remove();
                   }
           
		   // Scroll bottom on click js //
			$(".view-detail-img-icon, .restore-detail").click(function() {
				$('html,body').animate({
					scrollTop: $(".details-section").offset().top},
				'slow');
			});


		 // On scroll Div Fixed For compare section js //

			 $(window).scroll(function(){
    if($(this).scrollTop() > 150){
      $('.compare-div').addClass('sticky-compare')
      $('.compare-mtop').addClass('margintop-div')
	  $('img[src="../../../../images/vs-icon.png"]').each(function(){
    $(this).attr("src","../../../../images/vs-white-icon.png");
});
    }
    else
	{	
	$('.compare-div').removeClass("sticky-compare")
	 $('.compare-mtop').removeClass('margintop-div')
	  $('img[src="../../../../images/vs-white-icon.png"]').each(function(){
    $(this).attr("src","../../../../images/vs-icon.png");
});

	}
  });
			

	/* CMS Blog Edit js */
	$(".edit-field-show").hide();
	$(".edit-link").click(function(){
	$(this).closest('.project-list-view').find('.edit-field-show').show();
	$(this).closest('.project-list-view').find('.hide-edit-show').hide();
	}); 
	$(".cancel-edit").click(function(){
	$(this).closest('.project-list-view').find('.edit-field-show').hide();
	$(this).closest('.project-list-view').find('.hide-edit-show').show();
	}); 

	
	/* Revision History Section JS */
	$(".revision-preview").click(function(){
    $(".revision-history").show();
	});
	$(".revision-history-close").click(function(){
    $(".revision-history").hide();

	});
	
		/* Reply Comment Section JS */
	$(".reply-box").click(function(){
    $(".reply-comment").show();
	});
	$(".reply-comment-close").click(function(){
    $(".reply-comment").hide();

	});
	
	
	// Boostarp Dropdown Arrow Placement js */
$(window).scroll(function() {
	customeDropdownArraow();
});
$('.dropdown-toggle').click(function(){

	//alert($(this).offset().top-200);
	var height = $(this).next('.dropdown-menu').outerHeight();
	var offsetHeight = Math.abs($(this).offset().top - $(window).scrollTop() - $(window).outerHeight());
	$(this).next('.dropdown-menu').removeClass('bstop-arrow');
	if(offsetHeight < height){
		$(this).next('.dropdown-menu').addClass('bstop-arrow');
	}

})

function customeDropdownArraow(){
	$('[x-placement="bottom-start"]').removeClass('bstop-arrow');
	$('[x-placement="bottom-end"]').removeClass('bstop-arrow');
	if($('[x-placement="top-start"]').length){
		$('[x-placement="top-start"]').addClass('bstop-arrow');
	}
	if($('[x-placement="top-end"]').length){
		$('[x-placement="top-end"]').addClass('bstop-arrow');
	}
}

// Blog Publish Dropdwon Menu js //
	$(".publish-btn").click(function(){
		$(".publish-dropdown").toggle();
	});
	
	$(".draft-radio").click(function(){
		$(".publish-options").hide();
		$("#publish-action").val("Save as Draft");
	});
	
	$(".publish-radio").click(function(){
		$(".publish-options").show();
		$("#publish-action").val("Publish");
	});
	
	
	$(".now-radio").click(function(){
		$(".schedule-date").hide();
		$("#publish-action").val("Publish");
	});
	
	$(".schedule-date").hide();
	$(".later-radio").click(function(){
		$(".schedule-date").show();
		$("#publish-action").val("Schedule");
	});
	
	
	$(".protected-radio").click(function(){
		$(".password-field").show();

	});
	
	$(".password-field").hide();
	$(".password-field-hide").click(function(){
		$(".password-field").hide();
		
	});
	
/*Input Fields Enable Disable From Checkbox*/
$('#check-disable').change(function(){
   $(".disable-field").prop("disabled", $(this).is(':checked'));
});

$('#check-disable').change(function(){
    if($(this).is(":checked")) {
        $('.disable-text-field').addClass("disable-text");
    } else {
        $('.disable-text-field').removeClass("disable-text");
    }
});
/*End*/

// Alers Auto Hide Js //
window.setTimeout(function() {
    $(".alert").fadeTo(1000, 0).slideUp(500, function(){
        $(this).slideUp(); 
    });
}, 4000);

// Bootstrap Color Picker js //
$(function() { 
	if($('#cp3').length){
	$('#cp3').colorpicker(
	{ color: '#AA3399' }
	);
	}
 });



// User Information Fixed Right Section Jquery //
	$(".user-info,#screen-overlay").click(function () {
		$(".user-info-block,#screen-overlay").fadeToggle();
		$(".user-info-block").toggleClass("d-block");
		$("#screen-overlay").toggleClass("d-block");		
	});
	
// User Information Fixed Right Assign role Section Jquery //
	$("#assign-role").click(function () {
		$(".assign-role").fadeToggle();
		$(".assign-role").toggleClass("d-block");
				
	});
	
	$("#screen-overlay").click(function () {		
		$(".assign-role").removeClass("d-block");		
	});
	
	
// User Information Fixed Right Section Close-btn Jquery //
	$(".addnewacc-close").click(function () {		
		$(".user-info-block").toggleClass("d-block");
		$("#screen-overlay").toggleClass("d-block");
		$(".assign-role").removeClass("d-block");		
	});
	
	$(".addnewacc-assign-close").click(function () {
		$(".assign-role").removeClass("d-block");		
	});
	
	
	
	/*$(".user-info,.screen-overlay").click(function () {
		
	});*/
	
	// User Profile Fixed Right Section Jquery //
	$(".user-profile-edit,.fade-overlay,.close-profile").click(function () {
		$(".user-profile-informtion").toggleClass("d-block");
		$(".fade-overlay").toggleClass("d-block");		
	});
	
	
	
	
	
	
/*Hides File Input & Makes Anchor as Upload Button*/
$("#upload_link_primary").on('click', function(e){
    e.preventDefault();
    $("#upload_primary:hidden").trigger('click');
});

$("#library_link_upload").on('click', function(e){
    e.preventDefault();
    $("#library_upload:hidden").trigger('click');
});

$("#upload_link_secondary").on('click', function(e){
    e.preventDefault();
    $("#upload_secondary:hidden").trigger('click');
});





// Make Recent Activities height equal to left section
var lsheight = $(".account-content-left").height();
var rsheight = lsheight+70;
$('.account-content-right').css('max-height', rsheight+'px');


//Switch page width on tabs click
$("#feeds-tab").click(function(){
	$('.account-section-right').hide();
    $('.account-section-left').removeClass('col-12 col-md-7 col-xl-8 p0 mb40');
    $('.account-section-left').addClass('col-12 col-md-12 p0 mb40');
});
$("#summary-tab").click(function(){
	$('.account-section-right').show();
    $('.account-section-left').removeClass('col-12 col-md-12 p0 mb40');
    $('.account-section-left').addClass('col-12 col-md-7 col-xl-8 p0 mb40');
});



var value=$("input[name=pic]").val();
$('#preview-pic img').attr('src',value);
	
var doj=$("input[name=doj]").val();
$("#preview-doj").text(doj);
//On KeyUp Update
$("input[name='name']").keyup(function(){
	var value=$("input[name=name]").val();
	$("#preview-name").text(value);
});
$("input[name='name']").keyup(function(){
	var value=$("input[name=name]").val();
	$("#preview-name").text(value);
});
$("input[name='email']").keyup(function(){
	var value=$("input[name=email]").val();
	$("#preview-email").text(value);
});
$("input[name='mobile']").keyup(function(){
	var value=$("input[name=mobile]").val();
	$("#preview-mobile").text(value);
});
$("input[name='role']").keyup(function(){
	var value=$("input[name=role]").val();
	$("#preview-role").text(value);
});
$("input[name='company']").keyup(function(){
	var value=$("input[name=company]").val();
	$("#preview-company").text(value);
});




//Email Editor
//Hide Elements By Default
$(".me-container").hide();
$(".me-cc-box").hide();
$(".me-bcc-box").hide();

$('#show-cc-box').on('click', function(){
	$(".me-cc-box").toggle();
});	
$('#show-bcc-box').on('click', function(){
	$(".me-bcc-box").toggle();
});	
$('#profile-mail').on('click', function(){
	$(".me-container").show();
});
//On Mail Editor Close Button
$('#me-close').on('click', function(){
	$(".me-container").hide();
	$(".screen-overlay-dark").hide();
	$("#me-fullscreen").show();
	$("#me-smallscreen").hide();
	$('#me-section').removeClass('me-container me-container-fullscreen col-12 col-md-10 col-lg-8 offset-0 offser-md-1 offset-lg-2 p0');
    $('#me-section').addClass('me-container col-12 col-md-6 col-lg-6 col-xl-5 p0');
});	
//On Mail Editor Minimize Button
$('#me-minimize').on('click', function(){
	$(".me-body").toggle();
	$(".screen-overlay-dark").hide();
	$("#me-fullscreen").show();
	$("#me-smallscreen").hide();
	$('#me-section').removeClass('me-container me-container-fullscreen col-12 col-md-10 col-lg-8 offset-0 offser-md-1 offset-lg-2 p0');
    $('#me-section').addClass('me-container col-12 col-md-6 col-lg-6 col-xl-5 p0');
});
//On Mail Editor Fullscreen Button
$('#me-fullscreen').on('click', function(){
	$(".screen-overlay-dark").show();
	$(".me-body").show();
	$("#me-fullscreen").hide();
	$("#me-smallscreen").show();
	$('#me-section').removeClass('me-container col-12 col-md-6 col-lg-6 col-xl-5 p0');
    $('#me-section').addClass('me-container me-container-fullscreen col-12 col-md-10 col-lg-8 offset-0 offser-md-1 offset-lg-2 p0');
});	
//On Mail Editor SmallScreen Button
$('#me-smallscreen').on('click', function(){
	$(".screen-overlay-dark").hide();
	$(".me-body").show();
	$("#me-fullscreen").show();
	$("#me-smallscreen").hide();
	$('#me-section').removeClass('me-container me-container-fullscreen col-12 col-md-10 col-lg-8 offset-0 offser-md-1 offset-lg-2 p0');
    $('#me-section').addClass('me-container col-12 col-md-6 col-lg-6 col-xl-5 p0');
});	
	

});





//Segment Graph Sticky OnScroll
window.onscroll = function() {SegmentDonutScroll()};

function SegmentDonutScroll() {
  var stickyelement = document.getElementById("segment-donut-chart");
if(stickyelement){
  var sticky = (stickyelement.offsetTop+430);

  if (window.pageYOffset >= sticky) {
    stickyelement.classList.add("sticky")
  } else {
    stickyelement.classList.remove("sticky");
  }}
}