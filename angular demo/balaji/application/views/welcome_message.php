<script type="text/javascript" 
            src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js">
</script>
<script type="text/javascript">

	function demo(){
		var url1 = '<?php echo site_url(API_FOLDER.SMART_FOLDER."Signup/index_get");?>';	
		$.ajax({
			type: 'POST',
			url: url1,
			data:'id=1',
			dataType:'json',
			success: function (output) {
			},
			error: function(output){
				 
			}
		});
	}
	setTimeout(function() {
		demo();
	}, 500);
</script>