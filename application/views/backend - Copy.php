<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" >
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
<script>
var baseUrl = '<?php echo $base_url; ?>';
var cdnUrl = '<?php echo $cdn_url; ?>';
</script>
<style>
.loader {
    background: url(<?php echo $base_url;?>assets/images/loader-orange.gif) center no-repeat #fff;
    position: fixed;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 9999;
}
</style>
</head>
<body>
<div class="loader"></div>
<div ng-view class="main-view"></div>
<script src="<?php echo $cdn_url; ?>assets/lib/requirejs/require.js" data-main="assets/backend/js/main"></script>
</body>
</html>