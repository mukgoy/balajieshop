<?php
$base_url = config_item('base_url');
$cdn_url = config_item('cdn_url');
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="mainApp" ng-controller="mainCtrl">
<head>
<base href="<?php echo $base_url; ?>">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="google" content="notranslate" /> 
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<script>
var baseUrl = '<?php echo $base_url; ?>';
var cdnUrl = '<?php echo $cdn_url; ?>';
</script>
<style>
[ng-cloakl]{
display: none;
}
</style>
<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,300italic,800italic,800,700italic,700,600italic,600,400italic,300%7CRoboto+Condensed:400,400i,700,700i%7CGreat+Vibes" rel="stylesheet">
<link rel="stylesheet" href="<?php echo $cdn_url; ?>assets/css/bootstrap.min.css">
<link rel="stylesheet" href="<?php echo $cdn_url; ?>assets/css/fontawesome-all.min.css">
<link rel="stylesheet" href="<?php echo $cdn_url; ?>assets/lib/bootstrap/bootstrap-select.css">
	
<!-- Custom Stylesheets -->	
<link rel="stylesheet" href="<?php echo $cdn_url; ?>assets/css/style.css">
<link rel="stylesheet" href="<?php echo $cdn_url; ?>assets/css/orange.css">
<link rel="stylesheet" href="<?php echo $cdn_url; ?>assets/css/style-dev.css">

</head>
<body ng-cloak>
<div class="loader" ng-show="activeLoaderCount"></div>
<div class="canvas canvas-box main-box">
	<div class="overlay-black"></div>
	<div class="header">
		<div class="fixed-header">
			<div class="container-fluid">
				<div class="header-logo">
					<ul class="list-unstyled list-inline" style="margin-bottom: 10px;">
					<li><a href="javascript:void(0)" id="sidenav-open"><span><i class="fa fa-bars"></i></span></a></li>
					<li class="shopping-cart">
					<a ng-href="#"><img ng-src="{{cdnUrl}}assets/images/balaji.png" style="height: 28px;bottom: 13px;position: absolute;"/></a>
					</li></ul>
				</div><!-- end header-logo -->
				
				<div class="header-links">
					<ul class="list-unstyled list-inline">
						<li class="shopping-cart"><a ng-href="" id="shc-side-open">
							<span><i class="fa fa-filter"></i></span>
						</a></li>
						<li class="shopping-cart"><a ng-href="" id="shc-side-open">
							<span><i class="fa fa-shopping-cart"></i></span><span class="cart-badge" ng-if="cart.length">{{cart.length}}</span>
						</a></li>
						<li class="search search-box-open"><a ng-href="">
							<span><i class="fa fa-search"></i></span>
						</a></li>
						<li><a ng-href="" id="usr-side-open">
							<span><i class="fa fa-ellipsis-v"></i></span>
						</a></li>
					</ul>
				</div><!-- end header-links -->
			</div><!-- end container-fluid -->
		</div><!-- end fixed-header -->
	</div>
	
	<div ng-view class="main-view"></div>
	
	<section id="footer" class="section-padding"> 
		<div class="container-fluid text-center">
			<h3><span><i class="far fa-star"></i>Res</span>taurant</h3>
			<ul class="footer-contact list-unstyled">
				<li><span><i class="fa fa-map-marker-alt"></i></span>Street # 3, Lorem ipsum dolor , California. </li>
				<li><span><i class="fa fa-envelope"></i></span>info@starrestaurant.com</li>
				<li><span><i class="fa fa-phone"></i></span>+123 1234 123456</li>
			</ul>

			<ul class="footer-social list-unstyled list-inline">
				<li><a href="#"><span><i class="fab fa-facebook-f"></i></span></a></li>
				<li><a href="#"><span><i class="fab fa-instagram"></i></span></a></li>
				<li><a href="#"><span><i class="fab fa-pinterest"></i></span></a></li>
				<li><a href="#"><span><i class="fab fa-twitter"></i></span></a></li>
				<li><a href="#"><span><i class="fab fa-dribbble"></i></span></a></li>
			</ul>
			<p class="copyright">© 2018 <a href="#"><span><i class="far fa-star"></i></span>Restaurant</a>. All rights reserved.</p>
		</div><!-- end container-fluid -->
	</section>
		
</div>

<?php include('./assets/html/products/header.html'); ?>
<!--<get-template item='assets/html/products/header.html'></get-template>-->

<div class="javascript-files">
<script src="<?php echo $cdn_url; ?>assets/lib/jquery/jquery.min.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/bootstrap/bootstrap.min.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/bootstrap/bootstrap-select.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/custom/custom-navigation.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/notify/notify.js"></script>

<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular.min.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular-route.min.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular-resource.min.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular-sanitize.min.js" ></script>

<script src="<?php echo $cdn_url; ?>assets/js/angular-app.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/js/angular-config.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/js/angular-controller.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/js/angular-directive.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/js/angular-filter.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/js/angular-helper.js" ></script>

<script src="<?php echo $cdn_url; ?>assets/lib/requirejs/require.js" data-main="assets/js/main"></script>
</div>
</body>
</html>




