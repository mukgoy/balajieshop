<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="mainApp" ng-controller="mainCtrl">
<head >
<?php
$base_url = config_item('base_url');
$cdn_url = config_item('cdn_url');
?>
<base href="<?php echo $base_url; ?>">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="google" content="notranslate" /> 
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">
<style>
.loader {
    background: url(<?php echo $cdn_url;?>assets/images/loader-orange.gif) center no-repeat #fff;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
}
</style>
<link rel="stylesheet" ng-href="assets/css/bootstrap.min.css">
<link rel="stylesheet" ng-href="assets/css/fontawesome-all.min.css">
<link rel="stylesheet" ng-href="assets/lib/bootstrap/bootstrap-select.css">

<link ng-href="assets/backend/vendor/metisMenu/metisMenu.min.css" rel="stylesheet">
<link ng-href="assets/backend/vendor/datatables-plugins/dataTables.bootstrap.css" rel="stylesheet">
<link ng-href="assets/backend/vendor/datatables-responsive/dataTables.responsive.css" rel="stylesheet">
<link ng-href="assets/backend/dist/css/sb-admin-2.css" rel="stylesheet">
<link rel="stylesheet" ng-href="assets/backend/css/style-dev.css">
<script>
var baseUrl = '<?php echo $base_url; ?>';
var cdnUrl = '<?php echo $cdn_url; ?>';
</script>

</head>
<body>
<div class="loader"></div>
<div ng-view class="main-view"></div>
<div class="javascript-files">
<script src="<?php echo $cdn_url; ?>assets/lib/jquery/jquery.min.js" ></script>
<script src="<?php echo $cdn_url; ?>assets/lib/bootstrap/bootstrap.min.js"></script>
<script src="<?php echo $cdn_url; ?>assets/lib/bootstrap/bootstrap-select.js"></script>
<script src="<?php echo $cdn_url; ?>assets/lib/notify/notify.js"></script>

<script src="<?php echo $cdn_url; ?>assets/backend/vendor/metisMenu/metisMenu.min.js"></script>
<script src="<?php echo $cdn_url; ?>assets/backend/dist/js/sb-admin-2.js"></script>


<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular.min.js"></script>
<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular-animate.min.js"></script>
<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular-resource.min.js"></script>
<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular-route.min.js"></script>
<script src="<?php echo $cdn_url; ?>assets/lib/angularjs/angular-sanitize.min.js"></script>

<script src="<?php echo $cdn_url; ?>assets/lib/bootstrap/ui-bootstrap-tpls-2.5.0.js"></script> 
<!--<script src="<?php echo $cdn_url; ?>assets/lib/tags/ng-tags-input.min.js"></script>-->

<script src="<?php echo $cdn_url; ?>assets/backend/js/angular-app.js"></script>
<script src="<?php echo $cdn_url; ?>assets/backend/js/routeResolver.js"></script>
<script src="<?php echo $cdn_url; ?>assets/backend/js/angular-config.js"></script>
<script src="<?php echo $cdn_url; ?>assets/backend/js/angular-controller.js"></script>
<script src="<?php echo $cdn_url; ?>assets/backend/js/angular-directive.js"></script>
<script src="<?php echo $cdn_url; ?>assets/backend/js/angular-filter.js"></script>
<script src="<?php echo $cdn_url; ?>assets/backend/js/angular-helper.js"></script>

<script src="<?php echo $cdn_url; ?>assets/lib/requirejs/require.js" data-main="assets/backend/js/main"></script>
</div>
</body>
</html>