<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="mainApp" ng-controller="mainCtrl">
<head >
<?php
$base_url = config_item('base_url');
$cdnUrl = config_item('cdnUrl');
$ng_init = array('baseUrl'=>$base_url,'cdnUrl'=>$cdnUrl);

?>

<base href="<?php echo $base_url; ?>">

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="google" content="notranslate" /> 
<!-- Tell the browser to be responsive to screen width -->
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<!-- fonts-->
<style>
[ng-cloakl]{
display: none;
}
</style>
<script>
var baseUrl = '<?php echo $base_url; ?>';
var cdnUrl = '<?php echo $cdnUrl; ?>';
</script>


<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/plugins/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/css/general.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/css/elements.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/css/pagination.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/plugins/bootstrap/bootstrap-select.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>apps/smart/css/header.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>apps/smart/css/custom.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/plugins/scrollbar/jquery.mCustomScrollbar.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/plugins/tel-input/intlTelInput.css">
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/plugins/flagstrap/css/flags.css" >
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/plugins/tags/ng-tags-input.min.css" />
<link rel="stylesheet" href="<?php echo $cdnUrl; ?>assets/plugins/caleran/caleran.min.css" />
<!------- CMS Stylesheet------=------->
<link rel="stylesheet" ng-href="<?php echo $cdnUrl; ?>apps/cms/css/cms.css">
<!------- CMS Stylesheet end---------->
</head>
<body ng-cloak>
<div ng-init='init(<?php echo json_encode($ng_init); ?>)'></div>


<div ng-view class="main-view"></div>

<get-template item='apps/smart/html/smart-confirmation-box.html'></get-template>

<div class="javascript-files">
<script src="<?php echo $cdnUrl; ?>assets/plugins/jquery/jquery.min.js" ></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/bootstrap/popper.min.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/bootstrap/bootstrap.min.js" ></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/bootstrap/bootstrap-select.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/notify/notify.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/screenfull.js"></script>

<script src="<?php echo $cdnUrl; ?>assets/plugins/caleran/moment.min.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/caleran/caleran.min.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/expandsearch.js"></script>

<script src="<?php echo $cdnUrl; ?>assets/plugins/tel-input/intlTelInput.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/flagstrap/js/jquery.flagstrap.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>



<script src="<?php echo $cdnUrl; ?>assets/plugins/angularjs/angular.min.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/angularjs/angular-animate.min.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/angularjs/angular-resource.min.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/angularjs/angular-route.min.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/plugins/angularjs/angular-sanitize.min.js"></script>

<script src="<?php echo $cdnUrl; ?>assets/plugins/bootstrap/ui-bootstrap-tpls-2.5.0.js"></script> 
<script src="<?php echo $cdnUrl; ?>assets/plugins/tags/ng-tags-input.min.js"></script> 

<script src="<?php echo $cdnUrl; ?>assets/js/angular-app.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/routeResolver.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/angular-config.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/angular-controller.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/angular-directive.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/angular-filter.js"></script>
<script src="<?php echo $cdnUrl; ?>assets/js/angular-helper.js"></script>


<script src="<?php echo $cdnUrl; ?>assets/plugins/color-picker/bootstrap-colorpicker-module.js"></script>
<link rel="stylesheet" href="http://web.hostdmk.net/github/colorpicker_v3/css/colorpicker.css"/>


<!-- 
<script src="<?php //echo $cdnUrl; ?>assets/js/script.js"></script>
-->
<script src="<?php echo $cdnUrl; ?>assets/js/require.js" data-main="assets/js/main"></script>

</div>

</body>
</html>