var previousData = {};
var businessId = "fdfgghfg";
var videoAppCtrl = function ($scope, $rootScope, $location,$timeout) {
	$scope.draw = 1;
	$scope.current_app_logo = 'Videos';
	$scope.current_app_logo_type = 'text';
	$scope.headerMenu = 'apps/video/html/video-header-menu.html';
	$rootScope.loader = 0;
	$rootScope.activeModule = {videos:true};

	$scope.log = function(str){
		console.log(str);
	}
	// addVideoSuccess
};

var uploadVideosCtrl = function ($scope, $rootScope, $location,$timeout,$interval, $http, form) {

	var loader = '';
	var videoTypes = ['avi', 'divx', 'flv', 'm4v', 'mkv', 'mov', 'mp4', 'mpeg', 'mpg', 'ogm', 'ogv', 'ogx', 'rm', 'rmvb', 'smil', 'webm', 'wmv', 'xvid', '3gp', 'flv'];  
	var videoTypes = ['mkv', 'mp4','wmv'];  
	var BYTES_PER_CHUNK = parseInt(1048576*1, 10);
	// fileStatus = queue/error/resume/pause/cancelled/uploaded/;
	$scope.uploadingVideos = [];

	$scope.upload = function(files) {
		$scope.projectId = previousData.project_id;
		$scope.projectId = getCookie('project_id');
		// $scope.projectId = 117;
		if($scope.projectId == '' || $scope.projectId == undefined){
			alert("Select Project First");
			return;
		}
		var length = $scope.uploadingVideos.length;
		for (var i = 0; i < files.length; i++){
			if(validateVideoFile(files[i])){
				var fileStatus = 'queue';
			}else{
				var fileStatus = 'error';
				sagNotify(files[i].name + ' is not valid', "error");
				continue;
			}
			
			var id = length+i;
			$scope.uploadingVideos.push({
											id			: id,
											file		: files[i],
											thumb		: loader,
											slug		: '',
											videoId		: 0, 
											size		: files[i].size,
											numChunks	: Math.max(Math.ceil(files[i].size / BYTES_PER_CHUNK), 1),
											start		: 0,
											end			: BYTES_PER_CHUNK,
											currentChunk : 1,
											uploadPercent : 0,
											processPercent : 0,
											status		: fileStatus,
											ajax		: 0
										});
			$scope.resumeUpload(id);
		}
		$scope.$apply();
	};

	$scope.resumeUpload = function(id){
		if($scope.uploadingVideos[id].status == "error"){
			return;
		}
		$scope.uploadingVideos[id].status = "resume";
		$scope.initUpload(id);
	}
	
	$scope.initUpload = function(id){
		$scope.uploadNextChunk(id);
	}
	
	$scope.uploadNextChunk = function(id){
		if($scope.uploadingVideos[id].status == "pause" || $scope.uploadingVideos[id].ajax){ //check video is not pause
			return;
		}
		var videoObj = $scope.uploadingVideos[id];
		if(videoObj.start < videoObj.size){
			$scope.uploadChunk(id);
		}
	}
	
	$scope.uploadChunk = function(id){
		var videoObj = $scope.uploadingVideos[id];
		var blobOrFile = videoObj.file.slice(videoObj.start, videoObj.end);
		$scope.uploadingVideos[id].start 	= videoObj.end;
		$scope.uploadingVideos[id].end 		= videoObj.start + BYTES_PER_CHUNK;
		$scope.uploadingVideos[id].ajax 	= 1;

		var filename = videoObj.file.name;
		var FileExtension = filename.substr((filename.lastIndexOf('.') +1));
		
		var formdata = new FormData();
			formdata.append('project_id', $scope.projectId);
			formdata.append('video_id', videoObj.videoId);
			formdata.append('video_slug', videoObj.slug);
			formdata.append('video_title', videoObj.file.name);
			formdata.append('video_filename', videoObj.file.name);
			formdata.append('video_ext',FileExtension);
			formdata.append('filedata',blobOrFile);
			
		var ajax = new XMLHttpRequest();
			ajax.upload.addEventListener("progress", function(event){$scope.UploadHandler(id, event);}, false);
			ajax.addEventListener("load", function(event){$scope.uploadChunkDone(id, event);}, false);
			ajax.open("POST", baseUrl+'api/video/videoupload/append_parts');
			ajax.send(formdata);
	}
	
	$scope.UploadHandler = function(id, event){
		var videoObj = $scope.uploadingVideos[id];
		if(BYTES_PER_CHUNK > videoObj.size){
			var percent = 0;
		}else{
			var percent = ((videoObj.start-BYTES_PER_CHUNK)/videoObj.size)*100;
		}
		percent = Number(percent) + Number((event.loaded/event.total/videoObj.numChunks) * 100);
		if(percent>100){percent = 100;}
		$scope.uploadingVideos[id].uploadPercent = Math.floor(percent);
		// console.log(percent);
		$scope.$apply();
	}

	$scope.uploadChunkDone = function(id, event){
		var response = JSON.parse(event.target.responseText);
		var videoObj = $scope.uploadingVideos[id];
		
		if($scope.uploadingVideos[id].status == "cancelled"){
			// $rootScope.loader++;
			$http.get(baseUrl+'api/video/videoupload/cancel_upload?video_slug='+response.video_slug)
			.then(function(response){
				// $rootScope.loader--;
			});
			return;
		}
		$scope.uploadingVideos[id].slug = response.video_slug;
		$scope.uploadingVideos[id].videoId = response.video_id;
		$scope.uploadingVideos[id].ajax 	= 0;
		
		if(videoObj.start > videoObj.size){
			$scope.uploadingVideos[id].thumb = response.thumb_url;
			$scope.uploadingVideos[id].uploadPercent = 100;
			$scope.uploadingVideos[id].status = "uploaded";
			$scope.$apply();
			
			$scope.uploadQueueDone(id);
		}else{
			$scope.$apply();
			$scope.uploadNextChunk(id);
		}
	}

	$scope.uploadPause = function(id){
		if($scope.uploadingVideos[id].status == "error"){
			return;
		}
		$scope.uploadingVideos[id].status = 'pause';
	}
	
	$scope.uploadCancel = function(id){
		if($scope.uploadingVideos[id].status == "error"){
			// return;
		}
		else{
			var redirect = 0;
			deleteConfirm(function(){$scope.deleteItems(redirect)},"Are you sure you want to delete?", 'Confirm Delete?');
		}
		$scope.deleteItems = function(redirect){
			$rootScope.loader++;
			$scope.uploadingVideos[id].status = 'cancelled';
			$http.get(baseUrl+'api/video/videoupload/cancel_upload?video_slug='+$scope.uploadingVideos[id].slug)
			.then(function(response){
				$rootScope.loader--;
				$scope.uploadingVideos[id].status = 'cancelled';
			});
		}
		
	}
	
	$scope.uploadQueueDone = function(id){
		console.log($scope.uploadingVideos);
		$scope.pingCron(id);
	}
	
	$scope.pingCron = function(id){
		$scope.uploadingVideos[id].status = "processing";
		$http.get(baseUrl+'api/video/processor/videoprocess')
		.then(function(response){
			$scope.getProcessStatus(id);
		});
	}
	
	$scope.getProcessStatus = function(id){
		$http.get(baseUrl+'api/video/videos/get_process_status?video_id='+$scope.uploadingVideos[id].videoId)
		.then(function(response){
			if($scope.uploadingVideos[id].status == "cancelled"){
				$http.get(baseUrl+'api/video/videoupload/cancel_upload?video_slug='+$scope.uploadingVideos[id].slug)
				.then(function(response){});
				return;
			}
			if(response.data.status == 'processing'){
				$timeout(function () {
					$scope.uploadingVideos[id].processPercent = response.data.process_percent;
					if(response.data.process_percent == 100){
						$scope.pingCron(id);
						return;
					}
					$scope.getProcessStatus(id);
				}, 1000);
			}else{
				$scope.uploadingVideos[id].status = response.data.status;
				$scope.setPreview(id);
			}
		});
	}
	
	$scope.setPreview = function(id){
		$scope.uploadingVideos[id].preview = baseUrl+'embed/'+$scope.uploadingVideos[id].slug;
	}
	
	function validateVideoFile(file){
			var filename = file.name;
			var FileExtension = filename.substr( (filename.lastIndexOf('.') +1) );
			if(-1 == $.inArray(FileExtension, videoTypes)){
				return false;
			}
			return true;
	}
	
	$scope.pendingVideos = [];
	$scope.uploadedVideos = [];
	$interval(function () {
		$scope.pendingVideos = $scope.uploadingVideos.filter(function(uploadingVideo){
			return ["queue","resume","pause"].indexOf(uploadingVideo.status) > -1;
		});
		$scope.uploadedVideos = $scope.uploadingVideos.filter(function(uploadingVideo){
			return ["processing","uploaded","complete"].indexOf(uploadingVideo.status) > -1;
		});
    }, 1000);
	$scope.nextClick = function(){
		if($scope.pendingVideos.length > 0 || $scope.uploadedVideos.length==0){
			return;
		}
		var uploaded = $scope.pendingVideos = $scope.uploadingVideos.filter(function(uploadingVideo){
			return ["processing","uploaded","complete"].indexOf(uploadingVideo.status) > -1;
		});
		console.log($scope.uploadingVideos);
		if(uploaded.length == 1){
			$scope.redirect('video/video-manage/'+uploaded[0].videoId+'/details');
		}
		else{
			$scope.redirect('video/videos');
		}
	}
	$scope.cancelClick = function(){
		if($scope.uploadingVideos.length == 0){
			$scope.redirect('video/videos');
			return;
		}else{
			deleteConfirm(function(){$scope.deleteItems()},"Are you sure you want to Cancel. All the video(s) will be deleted?", 'Confirm Delete?');
		}
		$scope.deleteItems = function(){
			var redirect = 0;
			$scope.uploadingVideos.filter(function(uploadingVideo){
				$rootScope.loader++;
				redirect++;
				$scope.uploadingVideos[uploadingVideo.id].status = 'cancelled';
				$http.get(baseUrl+'api/video/videoupload/cancel_upload?video_slug='+uploadingVideo.slug)
				.then(function(response){
					$scope.uploadingVideos[uploadingVideo.id].status = 'cancelled';
					$rootScope.loader--;
					redirect--;
					if(redirect==0){
						$scope.redirect('video/videos');
					}
					
				});
			});
		}
			

		
	}
	
	$scope.openLibrary = function(){
		$scope.projectId = previousData.project_id;
		$scope.projectId = getCookie('project_id');
		if($scope.projectId == '' || $scope.projectId == undefined){
			sagNotify('Project Not selected', "error");
			return;
		}
		$scope.open_smart_library('video',$scope.addVideoFromLibrary, true);
	}

	$scope.addVideoFromLibrary = function(multi_response){
		response_count = 0;
		angular.forEach(multi_response, function(response, key) {
			console.log(response);
			$rootScope.loader++;
			params = {
				'project_id' : getCookie('project_id'),
				'video_id' : response.video_id,
			}
			form.submit(baseUrl+'api/video/videoupload/add_from_library', params)
			.then(function(response){
				response_count++;
				//$rootScope.loader--;
				var data = response.data;
				if(response_count == multi_response.length){
					$rootScope.loader == 0;
					processResponse(data, $scope);
					if(multi_response.length > 1){
						$scope.redirect('video/videos');
					}else{
						$scope.redirect('video/video-manage/'+data.video_id+'/details');
					}
				}
			});
		});
	}
	
}
var replaceVideosCtrl = function ($scope, $rootScope,$route, $location,$timeout,$interval, $http, $routeParams,form) {
	
	$scope.video_id = $routeParams.video_id;
	var loader = '';
	var videoTypes = ['avi', 'divx', 'flv', 'm4v', 'mkv', 'mov', 'mp4', 'mpeg', 'mpg', 'ogm', 'ogv', 'ogx', 'rm', 'rmvb', 'smil', 'webm', 'wmv', 'xvid', '3gp', 'flv'];  
	var videoTypes = ['mkv', 'mp4','wmv'];
	var BYTES_PER_CHUNK = parseInt(1048576*1, 10);
	$scope.uploadingVideos = [];
	$scope.upload = function(files) {
		
		if(files.length > 1){
			sagNotify('select one file only', "error");
			return;
		}
		var options = {
			'image':'{{cdnUrl}}/assets/images/replace-video-icon.png',
			'title':'Replace',
			'description':' Are you sure you want to Replace Video ? </br> All the stats will be lost if replaced',
			'btnCancel':'Cancel',
			'btnConfirm':'&nbsp;&nbsp;Confirm&nbsp;&nbsp',
			'modal-copy-size':'modal-copy-size'
		};
		smartVideoConfirm(function(){		
		var length = $scope.uploadingVideos.length;
		for (var i = 0; i < files.length; i++){
			if(validateVideoFile(files[i])){
				var fileStatus = 'queue';
			}else{
				var fileStatus = 'error';
				sagNotify(files[i].name + ' is not valid', "error");
				continue;
			}
			
			var id = length+i;
			$scope.uploadingVideos.push({
											id			: id,
											file		: files[i],
											thumb		: loader,
											slug		: $scope.video_slug,
											videoId		: $scope.video_id, 
											size		: files[i].size,
											numChunks	: Math.max(Math.ceil(files[i].size / BYTES_PER_CHUNK), 1),
											start		: 0,
											end			: BYTES_PER_CHUNK,
											currentChunk : 1,
											uploadPercent : 0,
											processPercent : 0,
											status		: fileStatus,
											ajax		: 0
										});
			$scope.resumeUpload(id);
		}
		$scope.$apply();
	},options);
	};

	$scope.resumeUpload = function(id){
		if($scope.uploadingVideos[id].status == "error"){
			return;
		}
		$scope.uploadingVideos[id].status = "resume";
		$scope.initUpload(id);
	}
	
	$scope.initUpload = function(id){
		$scope.uploadNextChunk(id);
	}
	
	$scope.uploadNextChunk = function(id){
		if($scope.uploadingVideos[id].status == "pause" || $scope.uploadingVideos[id].ajax){ //check video is not pause
			return;
		}
		var videoObj = $scope.uploadingVideos[id];
		if(videoObj.start < videoObj.size){
			$scope.uploadChunk(id);
		}
	}
	
	$scope.uploadChunk = function(id){
		var videoObj = $scope.uploadingVideos[id];
		var blobOrFile = videoObj.file.slice(videoObj.start, videoObj.end);
		$scope.uploadingVideos[id].start 	= videoObj.end;
		$scope.uploadingVideos[id].end 		= videoObj.start + BYTES_PER_CHUNK;
		$scope.uploadingVideos[id].ajax 	= 1;

		var filename = videoObj.file.name;
		var FileExtension = filename.substr((filename.lastIndexOf('.') +1));
		
		var formdata = new FormData();
			formdata.append('project_id', $scope.projectId);
			formdata.append('video_id', videoObj.videoId);
			if(videoObj.slug !== undefined){
				formdata.append('video_slug', videoObj.slug);
			}
			formdata.append('video_title', videoObj.file.name);
			formdata.append('video_filename', videoObj.file.name);
			formdata.append('video_ext',FileExtension);
			formdata.append('filedata',blobOrFile);
			
		var ajax = new XMLHttpRequest();
			ajax.upload.addEventListener("progress", function(event){$scope.UploadHandler(id, event);}, false);
			ajax.addEventListener("load", function(event){$scope.uploadChunkDone(id, event);}, false);
			ajax.open("POST", baseUrl+'api/video/videoreplace/append_parts');
			ajax.send(formdata);
	}
	
	$scope.UploadHandler_hold = function(id, event){
		var videoObj = $scope.uploadingVideos[id];
		var percent = videoObj.start > videoObj.size ? (videoObj.size-BYTES_PER_CHUNK)/videoObj.size : (videoObj.start-BYTES_PER_CHUNK)/videoObj.size;
		var percent = [(event.loaded/event.total/videoObj.numChunks) + percent] * 100;
			$scope.uploadingVideos[id].uploadPercent = Math.floor(percent);
			$scope.$apply();
	}
	$scope.UploadHandler = function(id, event){
		var videoObj = $scope.uploadingVideos[id];
		if(BYTES_PER_CHUNK > videoObj.size){
			var percent = 0;
		}else{
			var percent = ((videoObj.start-BYTES_PER_CHUNK)/videoObj.size)*100;
		}
		percent = Number(percent) + Number((event.loaded/event.total/videoObj.numChunks) * 100);
		if(percent>100){percent = 100;}
		$scope.uploadingVideos[id].uploadPercent = Math.floor(percent);
		console.log(percent);
		$scope.$apply();
	}

	$scope.uploadChunkDone = function(id, event){
		var response = JSON.parse(event.target.responseText);
		var videoObj = $scope.uploadingVideos[id];
		
		if($scope.uploadingVideos[id].status == "cancelled"){
			$http.get(baseUrl+'api/video/videoupload/cancel_upload?video_slug='+response.video_slug)
			.then(function(response){
				
			});
			return;
		}
		$scope.uploadingVideos[id].slug = response.video_slug;
		//$scope.uploadingVideos[id].videoId = response.video_id;
		$scope.uploadingVideos[id].ajax 	= 0;
		
		if(videoObj.start > videoObj.size){
			$scope.uploadingVideos[id].thumb = response.thumb_url;
			$scope.uploadingVideos[id].uploadPercent = 100;
			$scope.uploadingVideos[id].status = "uploaded";
			$scope.$apply();
			$scope.uploadQueueDone(id);
		}else{
			$scope.$apply();
			$scope.uploadNextChunk(id);
		}
	}

	$scope.uploadPause = function(id){
		if($scope.uploadingVideos[id].status == "error"){
			return;
		}
		$scope.uploadingVideos[id].status = 'pause';
	}
	$scope.uploadCancel = function(id){
		deleteConfirm(function(){
			if($scope.uploadingVideos[id].status == "error"){
				return;
			}
			$scope.uploadingVideos[id].status = 'cancelled';
		},"Are you sure you want to Cancel.", 'Confirm?');
	}
	
	$scope.uploadQueueDone = function(id){
		console.log($scope.uploadingVideos);
		$scope.pingCron(id);
		sagNotify('Uploaded Successfully', "success");
		$route.reload();
	}
	
	$scope.pingCron = function(id){
		$scope.uploadingVideos[id].status = "processing";
		$http.get(baseUrl+'api/video/processor/videoprocess')
		.then(function(response){
			$scope.getProcessStatus(id);
		});
	}
	
	$scope.getProcessStatus = function(id){
		$http.get(baseUrl+'api/video/videos/get_process_status?video_id='+$scope.uploadingVideos[id].videoId)
		.then(function(response){
			if(response.data.status == 'processing'){
				$timeout(function () {
					$scope.uploadingVideos[id].processPercent = response.data.process_percent;
					if(response.data.process_percent == 100){
						$scope.pingCron(id);
						return;
					}
					$scope.getProcessStatus(id);
				}, 1000);
			}else{
				$scope.uploadingVideos[id].status = response.data.status;
				$scope.setPreview(id);
			}
		});
	}
	
	$scope.setPreview = function(id){
		$scope.uploadingVideos[id].preview = baseUrl+'embed/'+$scope.uploadingVideos[id].slug;
	}
	
	function validateVideoFile(file){
			var filename = file.name;
			var FileExtension = filename.substr( (filename.lastIndexOf('.') +1) );
			if(-1 == $.inArray(FileExtension, videoTypes)){
				return false;
			}
			return true;
	}
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
		

	$scope.pendingVideos = [];
	$scope.uploadedVideos = [];
	$interval(function () {
		$scope.pendingVideos = $scope.uploadingVideos.filter(function(uploadingVideo){
			return ["queue","resume","pause"].indexOf(uploadingVideo.status) > -1;
		});
		$scope.uploadedVideos = $scope.uploadingVideos.filter(function(uploadingVideo){
			return ["processing","uploaded","complete"].indexOf(uploadingVideo.status) > -1;
		});
	}, 1000);
	
	$scope.openLibrary = function(){
		var options = {
			'image':'{{cdnUrl}}/assets/images/replace-video-icon.png',
			'title':'Replace',
			'description':' Are you sure you want to Replace Video ? </br> All the stats will be lost if replaced',
			'btnCancel':'Cancel',
			'btnConfirm':'&nbsp;&nbsp;Confirm&nbsp;&nbsp',
			'modal-copy-size':'modal-copy-size'
		};
		smartVideoConfirm(function(){$scope.open_smart_library('video',$scope.addVideoFromLibrary)},options);		
	}	

	$scope.addVideoFromLibrary = function(response){
		console.log(response.video_id);
		$rootScope.loader = true;
		params = {			
			'library_video_id' : response.video_id,
			'video_id'         : $routeParams.video_id
		}
		form.submit(baseUrl+'api/video/videoreplace/add_from_library', params)
		.then(function(response){
			$rootScope.loader = false;
			var data = response.data;
			processResponse(data, $scope);
			$route.reload();
		});
	}
	
}

var projectListCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal){
	
	$rootScope.activeModule = {'projects':true};
	$scope.filters = [{}];
	$scope.getProjectList = function(){
		if($scope.projectParams === undefined) {
			$scope.projectParams = {
				fields:'',
				search_key:'',
				date_start:'',
				date_end:'',
				items_per_page:'10',
				current_page:1,
				order_by:'created_date',
				order_type:'desc',
				filter_by:''
			};
		}
		if($scope.projects === undefined) {
			$scope.projects = {};
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
		$scope.updateDateFilter($scope.projectParams);
		$scope.projectParams.filters = JSON.stringify($scope.filters);
		$scope.projectParams.draw = $scope.draw++;
		var queryStr = baseUrl +'api/video/projects',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});
		$scope.json_process = true;

		$http.get(queryStr)
		.then(function(response){
			$scope.json_process = false;
			response.data.data = appendChecked(response.data.data);
			$scope.projects = response.data;
			$scope.filterCounts();
		});
	}
	$scope.getProjectList();
	$scope.setDateFilters = function(){
		$scope.isFiltersSet = true;
		$scope.getProjectList();
	}
	$scope.$watch('filters', function(newVal, oldVal){
		if(newVal!=oldVal){
			$scope.isFiltersSet = true;
			$timeout(function(){ $scope.getProjectList();});
		}
	}, true);
	
	$scope.helpModalShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/help-modal.html',
				controller: 'projectListCtrl',
				size: 'dialog-centered modal-help-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
	

	$scope.addProjectSuccess = function() {
	
		$rootScope.$emit("addProjectSuccess", {});
		
			$scope.getProjectList();
			
		}
	$scope.mergeProjectSuccess = function() {
		$rootScope.$emit("mergeProjectSuccess", {});
		$scope.getProjectList();
	}
	$scope.updateProjectSuccess = function() {
		$rootScope.$emit("updateProjectSuccess", {});
		$scope.setDateFilters();
	}
	$scope.isNotFound = function() {
		if($scope.projects.length==0){
			if($scope.dateFrom=='' && $scope.dateTo=='' && $scope.searchKey=='' && $scope.currentPage==1){
				return false;
			}
			return true;
		}
		return false;
	}
	$scope.isEmpty = function() {
		if($scope.projects.length==0){
			if($scope.dateFrom=='' && $scope.dateTo=='' && $scope.searchKey=='' && $scope.currentPage==1){
				return true;
			}
		}
		return false;
	}
	
	
	$scope.deleteItemsConfirm = function(id){		
		if(id){
			var selected = id;
			deleteConfirm(function(){$scope.deleteItems(selected)},"Are you sure to delete projects?", 'Confirm Delete?');
		}
		else{
			var selected = [];
			angular.forEach($scope.projects.data, function(item){
				if(item.checked)
					selected.push(item.project_id)
			});
			deleteConfirm(function(){$scope.deleteItems(selected)},"Are you sure to delete projects?", 'Confirm Delete?');
		}
	}
	$scope.deleteItems = function(selected){
		var actionUrl = baseUrl +'api/video/projects/delete'
		var formData = new FormData();
		formData.append('callback', 'angular.element("#projectListCtrl").scope().getProjectList()');
		formData.append('ids', selected);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope)
		});
	}
			
	
	$scope.mergeProject = function(id){			
			var selected = [];
			angular.forEach($scope.projects.data, function(item){
				if(item.checked)
					selected.push(item.project_id)
			});
			if(selected.length > 2){
				sagNotify('Please Select Only Two Projects', "error");
				return;
			}			
			$scope.selected = selected;												
			var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/projects/merge-modal-popup.html',
				controller: 'modelProjectSelectCtrl',
				size: 'size-1  modal-dialog-centered',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return selected;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
		$scope.getProject = function(){			
			var queryStr = baseUrl +'api/video/items_list/project_list';
			$http.get(queryStr)
			.then(function(response){				
			$scope.model_projects = response.data;
			$scope.selectPickerRefresh();
			});
		}
		$scope.getProject();
		
					
	};
	$scope.cancel = function(item){
		angular.element("#projectListCtrl").scope().getProjectList();
	};	
	$scope.filterCounts = function() {
		var queryStr = baseUrl +'api/video/filter_counts/index/projects';		
		$http.get(queryStr)
		.then(function(response){
		 $scope.filter_counts = response.data.data;
		 $scope.selectPickerRefresh();
		});		
	};	
	$scope.item = {title: ''};
	$scope.addProject = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/projects/model-create.html',
				controller: 'projectCreateCtrl',
				size: 'size-1',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {										
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){								
				$scope.item = {};
			},
			function(){								
				$scope.item = {};
			}
			
		);
	};
	
	$scope.updateProject = function(item){
		$scope.item = item;
		var actionUrl = baseUrl +'api/video/projects/update'
		var formData = new FormData();
		formData.append('callback', 'angular.element("#projectListCtrl").scope().setDateFilters()');
		formData.append('project_id', item.project_id);
		formData.append('title', item.editedTitle);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope);
				$scope.item = {};
		});	
				
	}
	$scope.cancel = function (item) {		
		angular.element("#projectListCtrl").scope().setDateFilters();
	};
	$scope.openLibrary = function(project_id){
		$scope.project_id = project_id;			
		$scope.open_smart_library('image',$scope.updateThumbnail)
	}
	
	$scope.updateThumbnail = function(responce){ 
		var actionUrl = baseUrl +'api/video/projects/update_thumbnail'
		var formData = new FormData();
		formData.append('callback', 'angular.element("#projectListCtrl").scope().setDateFilters()');
		formData.append('project_id', $scope.project_id);
		formData.append('url', responce.url);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope)
		});	
		
	
	}
		
}
var projectCreateCtrl = function ($scope,$rootScope, $uibModalInstance, selectedItem, $log){
	
	$scope.item = selectedItem;
	$scope.addProjectSuccess = function() {
		
		$uibModalInstance.dismiss('cancel');
	}
	$rootScope.$on("addProjectSuccess", function(){
		$uibModalInstance.dismiss('cancel');
	 });
	$scope.submitUser = function(){		
		$uibModalInstance.close($scope.usr);
	};
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};	
	
	$scope.libraryAddThumbnail = function(){
		$scope.open_smart_library('image',$scope.addThumbnail)
	}
	$scope.addThumbnail = function(responce){
		$scope.item.thumbnail = responce.url;
	}
	$scope.removethumbnail =  function(item){				
		$scope.item.thumbnail='';
		$scope.selectPickerRefresh();
	}
}
var modelProjectSelectCtrl = function ($scope,$rootScope, $uibModalInstance, selectedItem, $log){
	$scope.model_project={};	
	$scope.model_project.selected_project_ids = selectedItem;
	$scope.mergeProjectSuccess = function() {
		$uibModalInstance.dismiss('cancel');
	}
	$rootScope.$on("mergeProjectSuccess", function(){
		$uibModalInstance.dismiss('cancel');
	 });
	$scope.submitUser = function(){
		$uibModalInstance.close($scope.usr);
	};
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};
	$scope.resetModelProjectID =  function(){		
		$scope.model_project.project_id='';
		$scope.selectPickerRefresh();
	}
	$scope.filterBy = function(e){
		return $scope.selected.indexOf(e.project_id)== -1;
	}
	
}

var videoListCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){
	
	$scope.filters = [{}];
	$scope.getVideoList = function(){
		if($scope.videoParams === undefined) {
			$scope.videoParams = {
				fields:'',
				search_key:'',
				date_start:'',
				date_end:'',
				items_per_page:'10',
				current_page:1,
				order_by:'created_date',
				order_type:'desc'
			};
		}
		if($scope.videos === undefined) {
			$scope.videos = {};
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
		$scope.updateDateFilter($scope.videoParams);
		$scope.videoParams.filters = JSON.stringify($scope.filters);
		$scope.videoParams.draw = $scope.draw++;
		if($routeParams.project_id != undefined){
			$scope.videoParams.project_id = $routeParams.project_id;
		}
		
		var queryStr = baseUrl +'api/video/videos',concate = '?';
		angular.forEach($scope.videoParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});
		$scope.json_process = true;

		$http.get(queryStr)
		.then(function(response){
			$scope.json_process = false;
			response.data.data = appendChecked(response.data.data);
			$scope.videos = response.data;
			$scope.filterCounts();			
		});
	}
	$scope.getVideoList();
	$scope.setDateFilters = function(){
		$scope.isFiltersSet = true;
		$scope.getVideoList();
	}
	$scope.$watch('filters', function(newVal, oldVal){
		if(newVal!=oldVal){
			$scope.isFiltersSet = true;
			$timeout(function(){ $scope.getVideoList();});
		}
	}, true);
	
  
	
	$scope.updateVideoSuccess = function() {
		$rootScope.$emit("updateVideoSuccess", {});
		$scope.setDateFilters();
	}
	$scope.isNotFound = function() {
		if($scope.videos.length==0){
			if($scope.dateFrom=='' && $scope.dateTo=='' && $scope.searchKey=='' && $scope.currentPage==1){
				return false;
			}
			return true;
		}
		return false;
	}
	$scope.isEmpty = function() {
		if($scope.videos.length==0){
			if($scope.dateFrom=='' && $scope.dateTo=='' && $scope.searchKey=='' && $scope.currentPage==1){
				return true;
			}
		}
		return false;
	}
	
	$scope.deleteItemsConfirm = function(id){		
		if(id){
			var selected = id;
			deleteConfirm(function(){$scope.deleteItems(selected)},"Are you sure to delete videos?", 'Confirm Delete?');
		}
		else{
			var selected = [];
			angular.forEach($scope.videos.data, function(item){
				if(item.checked)
					selected.push(item.video_id)
			});
			deleteConfirm(function(){$scope.deleteItems(selected)},"Are you sure to delete videos?", 'Confirm Delete?');
		}
	}
	$scope.deleteItems = function(selected){
		var actionUrl = baseUrl +'api/video/videos/delete'
		var formData = new FormData();
		formData.append('callback', 'angular.element("#videoListCtrl").scope().setDateFilters()');
		formData.append('ids', selected);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope)
		});
	}

	$scope.modelPopup = 'apps/video/html/videos/add-video-model.html';
	
	$scope.item = {title: ''};
	$scope.addVideo = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/videos/add-video-model.html',
				controller: 'videoCreateCtrl',
				size: 'size-1',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
	$scope.videoPreview = function(id){
		selected = id;				
		var dialogInst = $uibModal.open({
				templateUrl:cdnUrl+'apps/video/html/videos/video-preview.html',
				controller: 'videoCreateCtrl',
				size: 'library-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return selected;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
		
		$scope.getPreviewDetail();	
	};
	$scope.getPreviewDetail = function(){							
		var queryStr = baseUrl +'api/video/item_data/video/'+selected;
		$http.get(queryStr)
		.then(function(response){				
		$scope.video_details = response.data;
		$scope.selectPickerRefresh();
		});
	}
	
	$scope.updateVideo = function(item){
		$scope.item = item;
		var actionUrl = baseUrl +'api/video/videos/update'
		var formData = new FormData();
		formData.append('callback', 'angular.element("#videoListCtrl").scope().setDateFilters()');
		formData.append('video_id', item.video_id);
		formData.append('title', item.editedTitle);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope)
		});	
				
	}
	$scope.cancel = function (item) {		
		angular.element("#videoListCtrl").scope().setDateFilters();
	};	
	$scope.filterCounts = function() {	
		if($routeParams.project_id != undefined){			
			var queryStr = baseUrl +'api/video/filter_counts/index/videos?project_id='+$routeParams.project_id;	
		}else{	
		var queryStr = baseUrl +'api/video/filter_counts/index/videos';	
		}	
		$http.get(queryStr)
		.then(function(response){
		 $scope.filter_counts = response.data.data;
		 $scope.selectPickerRefresh();
		});		
	};	
	$scope.helpModalShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl:  cdnUrl+'apps/video/html/help-modal.html',
				controller: 'videoListCtrl',
				size: 'help-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
	$scope.openLibrary = function(video_id){
		$scope.video_id = video_id;			
		$scope.open_smart_library('image',$scope.updateThumbnail)
	}
	
	$scope.updateThumbnail = function(responce){ 
		var actionUrl = baseUrl +'api/video/videos/update_thumbnail'
		var formData = new FormData();
		formData.append('callback', 'angular.element("#videoListCtrl").scope().setDateFilters()');
		formData.append('video_id', $scope.video_id);
		formData.append('url', responce.url);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope)
		});	
		
	
	}
	$scope.projectList = function(){
		var queryStr = baseUrl + 'api/video/items_list/project_list';
		$http.get(queryStr)
		.then(function(response){				
		$scope.project_list = response.data;
		$scope.selectPickerRefresh();
		});		
	}
	$scope.projectList();
	// $scope.open_smart_library('image',$scope.callbacktesting); 
}
var videoCreateCtrl = function ($scope,$rootScope, $uibModalInstance,$http, selectedItem, $log, form){
	if($scope.videoParams.project_id != undefined){
		$scope.add_video = {project_id:$scope.videoParams.project_id};
	}else{
		$scope.add_video = {};
	}
	$scope.addVideoSuccess = function(){
		form.submit(baseUrl+'api/video/videos/upload', $scope.add_video)
		.then(function(response) {
			if(response.data.status == 'success'){
				previousData = {project_id : response.data.project_id};
				setCookie('project_id', response.data.project_id);
				$scope.redirect("video/upload");
				$uibModalInstance.dismiss('cancel');
			}else{
				processResponse(response.data, $scope, $scope.add_video);
			}
        });
	}
	$scope.submitUser = function(){
		$uibModalInstance.close($scope.usr);
	};
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
	};
	$scope.resetModelProjectID =  function(){		
		$scope.add_video.project_id='';
		$scope.selectPickerRefresh();
	}
	$scope.getVideo = function(){			
		var queryStr = baseUrl +'api/video/items_list/project_list';
		$http.get(queryStr)
		.then(function(response){				
		$scope.model_projects = response.data;
		$scope.selectPickerRefresh();
		});
	}
	$scope.getVideo();

}
var videoDetailCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal,$routeParams,form){
	
	$scope.getVideoDetail = function(){
		$scope.video_id = $routeParams.video_id;		
		var queryStr = baseUrl +'api/video/video_details';
		var formData = $.param({
			video_id: $scope.video_id,
		});		
		$http({
            method: 'POST',
            url: queryStr,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){			
			$scope.details = response.data;
		});
	}
	$scope.getVideoDetail();
	$scope.getCategory = function(){				
		var queryStr = baseUrl +'api/video/video_details/category_list';		
		$http.get(queryStr)
		.then(function(response){
			$scope.category_list = response.data;
			$scope.selectPickerRefresh(); 
		});
	}
	$scope.hideShowPassword = function(){
		if ($scope.inputType == 'password')
		  $scope.inputType = 'text';
		else
		  $scope.inputType = 'password';
	  };
	  		
	
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();	
	$scope.submitForm = function(actionUrl ,modal,isRedirect){		
		form.submit(actionUrl, modal)
		.then(function(response) {
			if (response.data.status == 'error') {
				processResponse(response.data, $scope, modal);
			}else{
				processResponse(response.data, $scope, modal);				
				if(isRedirect){
				$scope.redirect('video/video-manage/'+$routeParams.video_id+'/embedcode');
				}
			}
        });		
	}
	
	
}

var videoEmbedCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal,$routeParams,form){
	
	$scope.video_id = $routeParams.video_id;
	var actionUrl = baseUrl +'api/video/item_data/get_video_slug';
	form.submit(actionUrl, {video_id: $scope.video_id})
	.then(function(response) {
		// $scope.video_slug = response.data.slug_smart;
		// $scope.scripturl = baseUrl+'iembed_'+ $scope.video_slug +'.js';
		// $scope.FrameUrl  = baseUrl+'frame/'+$scope.video_slug;	

		$scope.video_slug = response.data.slug_smart;
		$scope.scripturl = baseUrl+'iembed_'+ $scope.video_slug +'.js';
		$scope.FrameUrl  = baseUrl+'api/video/embed/index/'+$scope.video_id;	
	});		
	$scope.embedtype = 'iframe';
	$scope.videodimensions = 'fullwidth';
	$scope.videowidth = '640';
	$scope.videoheight = '360';
	$scope.parseInt = function(val) { 
		return parseInt(val);
	}	
	$scope.heightchange = function(val) { 
		$scope.videowidth = parseInt($scope.videoheight * 16/9);
	  }
	  $scope.widthchange = function(val) { 
		$scope.videoheight =  parseInt($scope.videowidth * 9/16);
	  }
	  
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();		
}
var videoPlayerCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal,$routeParams){
	
	$scope.video_id = $routeParams.video_id;
	$scope.getCustomizeDetail = function(){		
		var player_theme_id = $scope.player_theme_id;
		var queryStr = baseUrl +'api/video/video_players';
		var formData = $.param({
			player_theme_id: player_theme_id,
		});		
		$http({
            method: 'POST',
            url: queryStr,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){			
			$scope.customize = response.data[0];
			$scope.selectPickerRefresh();
		});
		
	}
	//$scope.getCustomizeDetail();
	$scope.getPlayerTheme = function(){				
		var queryStr = baseUrl +'api/video/video_players/player_list';		
		$http.get(queryStr)
		.then(function(response){
			$scope.player_list = response.data;
			$scope.selectPickerRefresh(); 
		});
	}
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();	
		
}
var videoAdvertiseCtrl = function ($scope, $rootScope,$route, $location,$timeout,$interval, $http, $uibModal,$routeParams,form){
	
	$scope.video_id = $routeParams.video_id;
	$scope.advert = {video_id : $routeParams.video_id, skip_time : 5, type: '', video_time:0};
	$interval(function(){
		var mainCtrl = document.getElementById("cplayer").contentWindow.angular.element("#mainCtrl").scope();
		$scope.advert.video_time = parseInt(mainCtrl.getVideoObj().currentTime);
    }, 1000);
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
	$scope.getSegment = function(){				
		var queryStr = baseUrl +'api/video/video_advertise/segment_list';		
		$http.get(queryStr)
		.then(function(response){			
			$scope.segment_list = response.data;
			$scope.selectPickerRefresh(); 
		});
	}
	$scope.getDefaultTemplete = function(advert){
		if(advert == undefined){
			sagNotify("Please fill Advertisement Name","error"); 
			$scope.advert = {video_id : $routeParams.video_id, skip_time : 5, type: '', video_time:0};
			return;
		}
		var adverttypes = {"lead":0,"promo":1,"share":2};
		var queryStr = baseUrl + 'api/smart/Templates_default';
		var formData = $.param({
			conversion_type: adverttypes[$scope.advert.type],			
			current_page : 1,
			template_type: 1
		});		
		$http({
            method: 'POST',
            url: queryStr,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){							
			$scope.default_templete = response.data.message.records;			
		});
	}
	$scope.getCreateTemplete = function(advert){
		if(advert == undefined){
			sagNotify("Please fill Advertisement Name","error"); 
			$scope.advert = {video_id : $routeParams.video_id, skip_time : 5, type: '', video_time:0};
			return;
		}
		var adverttypes = {"lead":0,"promo":1,"share":2};
		var queryStr = baseUrl + 'api/smart/templates';
		var formData = $.param({
			type : 'adverts',
			conversion_type: adverttypes[$scope.advert.type],			
			current_page : 1			
		});		
		$http({
            method: 'POST',
            url: queryStr,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){							
			$scope.create_templete = response.data.message.records;			
		});
	}
	$scope.getAdvertisement =  function(){
		var queryStr = baseUrl + 'api/video/video_advertise';
		var formData = $.param({
			video_id : $scope.advert.video_id			
		});	
		$http({
            method: 'POST',
            url: queryStr,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){							
			$scope.advertisement = response.data.data;
			$scope.selectPickerRefresh();			
		});
	}
	$scope.getAdvertisement();
	$scope.editAdvertiseSuccess = function() {
		$rootScope.$emit("editAdvertiseSuccess", {});
		$scope.getAdvertisement();
	}
	$scope.deleteItemsConfirm = function(id){		
			var selected = id;
			deleteConfirm(function(){$scope.deleteItems(selected)},"Are you sure to delete advertisement?", 'Confirm Delete?');
	}
	$scope.deleteItems = function(selected){
		var actionUrl = baseUrl +'api/video/video_advertise/delete'
		var formData = new FormData();
		formData.append('callback', 'angular.element("#videoAdvertiseCtrl").scope().getAdvertisement()');
		formData.append('advert_id', selected);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope)
		});
	}
	$scope.editAdvertise = function(item){
		$scope.item = item;								
		var dialogInst = $uibModal.open({
			templateUrl: cdnUrl+'apps/video/html/video-manage/advertise-edit-modal.html',
			controller: 'videoUpdateAdvertiseCtrl',
			size: 'copy-size',
			windowClass : 'show',
			backdropClass : 'show',
			scope: $scope,
			resolve: {
				selectedItem: function () {
					return $scope.item;
				}
			}
		});
		dialogInst.result.then(function(newItem){
			$scope.item = {};
		},
		function(){
			$scope.item = {};
		});
    }		
	$scope.libraryAddThumbnail = function(){
		$scope.open_smart_library('image',$scope.addThumbnail)
	}
	$scope.addThumbnail = function(responce){		
		$scope.advert.thumbnail = responce.url;
	}
	$scope.submitForm = function(modal,isRedirect){
		var actionUrl = baseUrl+'api/video/video_advertise/add';
		form.submit(actionUrl, modal,isRedirect)
		.then(function(response) {
			if (response.data.status == 'error') {
				processResponse(response.data, $scope, modal);
			}else{
				if(['lead','promo','share'].indexOf($scope.advert.type) < 0){			
					$scope.getAdvertisement();
					sagNotify('Advertise Added Successfully','success');
					if(isRedirect){
						$scope.redirect('video/video-manage/'+$routeParams.video_id+'/embedcode');
					}
				}
				else{
					//alert('video/editor/advert/'+response.data.data.advert_id);
					var advert_id = response.data.data.advert_id;
					$scope.send_url = baseUrl+'video/editor/advert/'+advert_id;
					$scope.redirect_url = baseUrl+'video/video-manage/'+$routeParams.video_id+'/advertise';
					$scope.redirect_data = '';
					//console.log($scope.redirect_url); return; 
					$.redirectPost($scope.send_url, {'redirect_url':$scope.redirect_url,'redirect_data':$scope.redirect_data});
				}
				$scope.advert = {video_id : $routeParams.video_id, skip_time : 5, type: ''};	
			}
        });		
	}
	$scope.addDefalutTempleteId = function(id){
		$scope.template_default_id = id;				
		var actionUrl = baseUrl + 'api/smart/Templates/add';
		var formData  = $.param({
			template_default_id  : $scope.template_default_id
		});
		$http({
            method: 'POST',
            url: actionUrl,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){							
			$scope.advert.template_id = response.data.template_id;			
			$scope.submitForm($scope.advert);			
		});
		
		
	}
	$scope.openLibrary = function(){
		$scope.open_smart_library('video',$scope.addVideoFromLibrary);
	}

	$scope.addVideoFromLibrary = function(response){		
		$scope.advert.add_video_id = response.video_id;
		$scope.advert.video_url = response.url;
		$scope.advert.video_thumbnail = response.thumbnail;
		console.log(response);
	}
	$scope.reset = function(){
		$route.reload();
	}
	$scope.display_thumb = function(val){			
			$scope.thumb_url = val;
				
	}
	
}


var videoUpdateAdvertiseCtrl =  function($scope,$rootScope, $uibModalInstance,$interval, selectedItem, $log, form){
	
	$scope.item = selectedItem;
	$scope.editAdvertiseSuccess = function() {		
		$uibModalInstance.dismiss('cancel');
	}
	$rootScope.$on("editAdvertiseSuccess", function(){
		$uibModalInstance.dismiss('cancel');
	 });
	$scope.submitUser = function(){
		$uibModalInstance.close($scope.usr);
	};
	$scope.cancel = function(){
		$uibModalInstance.dismiss('cancel');
		$scope.getAdvertisement();
	};
	$scope.submitForm = function(actionUrl ,modal){
		var mainCtrl = document.getElementById("cplayer").contentWindow.angular.element("#mainCtrl").scope();
		var duration = parseInt(mainCtrl.getVideoObj().duration);
		if(strtosec(modal.video_time) > parseInt(duration)){
			$scope.item.error  = {video_time : "Time is more then video duration"};
			return;
		}
		
		var temp = angular.copy(modal);
		temp.video_time = strtosec(modal.video_time);
		form.submit(actionUrl, temp)
		.then(function(response) {
			processResponse(response.data, $scope, modal);
        });		
	}
}

var videoSubtitleCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal,$routeParams,form){
	
	$scope.getSubtitleDetail = function(){
		$scope.video_id = $routeParams.video_id;		
		var queryStr = baseUrl +'api/video/video_subtitle';
		var formData = $.param({
			video_id: $scope.video_id,
		});		
		$http({
            method: 'POST',
            url: queryStr,
            data: formData,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){			
			$scope.subtitles = response.data;
			$scope.resetFormData=angular.copy($scope.subtitles);
			console.log($scope.subtitles);
		});
	}
	$scope.modelShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/video-manage/video-subtitle-model.html',
				controller: 'videoSubtitleCtrl',
				size: 'size-1',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};

	$scope.getSubtitleDetail();	
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
	$scope.reset = function(){
		$scope.subtitles=angular.copy($scope.resetFormData);
	}
	$scope.submitForm = function(actionUrl ,modal,isRedirect){		
		form.submit(actionUrl, modal)
		.then(function(response) {
			if (response.data.status == 'error') {
				processResponse(response.data, $scope, modal);
			}else{
				processResponse(response.data, $scope, modal);				
				if(isRedirect){
				$scope.redirect('video/video-manage/'+$routeParams.video_id+'/embedcode');
				}
			}
        });		
	}
	
}

var playerThemeCtrl = function ($scope, $http, $timeout, $compile, $route, $routeParams,form) {
	
	var video_id = $routeParams.video_id;
	$scope.video_id = $routeParams.video_id;
	$scope.iframeParams = {'themeId':'','playerskin':'', 'random' : new Date().getTime()};
	$scope.themeForm = {};
	$scope.playerThemes = [];
	$scope.isChangeLogo = false;
	
	$scope.playerElements = {
		'1' : [
				{'title' : 'Center Play Button', 'slug' : 'centerplaybtn'},
				{'title' : 'Bottom Play Button', 'slug' : 'bottomplaybtn'},
				{'title' : 'Video Title', 		 'slug' : 'videotitle'},
				{'title' : 'Share Options', 	 'slug' : 'sharebtn'},
				{'title' : 'Play Bar', 			 'slug' : 'playbar'},
				{'title' : 'Volume Controls',	 'slug' : 'volumebtn'},
				{'title' : 'Control Button', 	 'slug' : 'controlbtn'},
				{'title' : 'FullScreen Button',  'slug' : 'fullscreenbtn'},
				{'title' : 'Logo',  			 'slug' : 'logo'},
				{'title' : 'Video Timer',  		 'slug' : 'ctime'}
		],
		'2' : [
				{'title' : 'Center Play Button', 'slug' : 'centerplaybtn'},
				{'title' : 'Bottom Play Button', 'slug' : 'bottomplaybtn'},
				{'title' : 'Video Title', 		 'slug' : 'videotitle'},
				{'title' : 'Share Options', 	 'slug' : 'sharebtn'},
				{'title' : 'Play Bar', 			 'slug' : 'playbar'},
				{'title' : 'Volume Controls',	 'slug' : 'volumebtn'},
				{'title' : 'Control Button', 	 'slug' : 'controlbtn'},
				{'title' : 'FullScreen Button',  'slug' : 'fullscreenbtn'},
				{'title' : 'Logo',  			 'slug' : 'logo'},
				{'title' : 'Video Timer',  		 'slug' : 'ctime'}
		],
		'3' : [
				{'title' : 'Center Play Button', 'slug' : 'centerplaybtn'},
				{'title' : 'Bottom Play Button', 'slug' : 'bottomplaybtn'},
				{'title' : 'Video Title', 		 'slug' : 'videotitle'},
				{'title' : 'Share Options', 	 'slug' : 'sharebtn'},
				{'title' : 'Play Bar', 			 'slug' : 'playbar'},
				{'title' : 'Volume Controls',	 'slug' : 'volumebtn'},
				{'title' : 'Control Button', 	 'slug' : 'controlbtn'},
				{'title' : 'FullScreen Button',  'slug' : 'fullscreenbtn'},
				{'title' : 'Logo',  			 'slug' : 'logo'},
				{'title' : 'Video Timer',  		 'slug' : 'ctime'}	
		],
		'4' : [
				{'title' : 'Center Play Button', 'slug' : 'centerplaybtn'},
				{'title' : 'Bottom Play Button', 'slug' : 'bottomplaybtn'},
				{'title' : 'Video Title', 		 'slug' : 'videotitle'},
				{'title' : 'Share Options', 	 'slug' : 'sharebtn'},
				{'title' : 'Play Bar', 			 'slug' : 'playbar'},
				{'title' : 'Volume Controls',	 'slug' : 'volumebtn'},
				{'title' : 'Control Button', 	 'slug' : 'controlbtn'},
				{'title' : 'FullScreen Button',  'slug' : 'fullscreenbtn'},
				{'title' : 'Logo',  			 'slug' : 'logo'},
				{'title' : 'Video Timer',  		 'slug' : 'ctime'}
		],
		'5' : [
				{'title' : 'Center Play Button', 'slug' : 'centerplaybtn'},
				{'title' : 'Bottom Play Button', 'slug' : 'bottomplaybtn'},
				{'title' : 'Video Title', 		 'slug' : 'videotitle'},
				{'title' : 'Share Options', 	 'slug' : 'sharebtn'},
				{'title' : 'Play Bar', 			 'slug' : 'playbar'},
				{'title' : 'Volume Controls',	 'slug' : 'volumebtn'},
				{'title' : 'Control Button', 	 'slug' : 'controlbtn'},
				{'title' : 'FullScreen Button',  'slug' : 'fullscreenbtn'},
				{'title' : 'Logo',  			 'slug' : 'logo'},
				{'title' : 'Video Timer',  		 'slug' : 'ctime'}
		],
		'6' : [
				{'title' : 'Center Play Button', 'slug' : 'centerplaybtn'},
				{'title' : 'Bottom Play Button', 'slug' : 'bottomplaybtn'},
				{'title' : 'Video Title', 		 'slug' : 'videotitle'},
				{'title' : 'Share Options', 	 'slug' : 'sharebtn'},
				{'title' : 'Play Bar', 			 'slug' : 'playbar'},
				{'title' : 'Volume Controls',	 'slug' : 'volumebtn'},
				{'title' : 'Control Button', 	 'slug' : 'controlbtn'},
				{'title' : 'FullScreen Button',  'slug' : 'fullscreenbtn'},
				{'title' : 'Logo',  			 'slug' : 'logo'},
				{'title' : 'Video Timer',  		 'slug' : 'ctime'}
		],
		'7' : [
				{'title' : 'Center Play Button', 'slug' : 'centerplaybtn'},
				{'title' : 'Bottom Play Button', 'slug' : 'bottomplaybtn'},
				{'title' : 'Video Title', 		 'slug' : 'videotitle'},
				{'title' : 'Share Options', 	 'slug' : 'sharebtn'},
				{'title' : 'Play Bar', 			 'slug' : 'playbar'},
				{'title' : 'Volume Controls',	 'slug' : 'volumebtn'},
				{'title' : 'Control Button', 	 'slug' : 'controlbtn'},
				{'title' : 'FullScreen Button',  'slug' : 'fullscreenbtn'},
				{'title' : 'Logo',  'slug' : 'logo'},
				{'title' : 'Current Time',  'slug' : 'ctime'},
				{'title' : 'Duration Time',  'slug' : 'dtime'}
		],
	}
	
	$scope.getPlayerThemes = function(){
		var actionUrl = baseUrl +'api/video/playertheme/get_themes?video_id='+video_id;
		$http({
			method  : 'POST',
			url     : actionUrl,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
			$scope.playerThemes = response.data;
			angular.forEach($scope.playerThemes, function(item){
				if(item.active){
					$scope.themeForm = JSON.parse(angular.toJson(item));
				}
			});
			$scope.changeTheme();
		});
	}
	$scope.getPlayerThemes();
	
	
	$scope.getIframeParams = function(){
		var str = 't='+$scope.iframeParams.random;
		if($scope.iframeParams.themeId){
			str += '&theme_id='+$scope.iframeParams.themeId;
		}
		if($scope.iframeParams.playerskin){
			str += '&playerskin='+$scope.iframeParams.playerskin;
		}
		return str;
	}
	
	$scope.changeTheme = function(){
		if($scope.themeForm.themeId==''){
			$scope.addNewTheme();
			$scope.is_disabled=false;
		}else{
			$scope.editTheme($scope.themeForm.themeId);
			if($scope.themeForm.themeId > 9){
				$scope.is_disabled=false;
			}else{
				$scope.is_disabled=true;
			}
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
	}
	$scope.addNewTheme = function(){
		$scope.themeForm = JSON.parse(angular.toJson($scope.playerThemes[0]))
		$scope.themeForm.themeId = '';
		$scope.themeForm.isIframeLoaded = false;
		$scope.iframeParams = {'themeId':1,'playerskin':'', 'random' : new Date().getTime()};
		$scope.isChangeLogo = false;
	}
	$scope.editTheme = function(themeId){
		angular.forEach($scope.playerThemes, function(item){
			if(item.themeId == themeId){
				$scope.themeForm = JSON.parse(angular.toJson(item));
			}
		});
		console.log($scope.themeForm);
		$scope.themeForm.isIframeLoaded = false;
		$scope.iframeParams = {'themeId':themeId,'playerskin':'', 'random' : new Date().getTime()};
		$scope.isChangeLogo = false;
	}
	$scope.previewTheme = function(themeId){
		$scope.themeForm = {};
		$scope.iframeParams = {'themeId':themeId,'playerskin':'','random': new Date().getTime()};
	}
	$scope.saveTheme = function(isRedirect){
		$scope.themeForm.error = {};
		if(!isUrlValid($scope.themeForm.logolink)){
			$scope.themeForm.error.logolink = "Invalid URL";
			return;
		}
		$scope.themeForm.video_id = $scope.video_id;
		$scope.themeForm.theme_apply = 0;
		if(isRedirect){
			$scope.themeForm.theme_apply = 1;
		}	
		var actionUrl = baseUrl +'api/video/playertheme/save_theme';		
		form.submit(actionUrl, $scope.themeForm)
		.then(function(response) {
			if (response.data.status == 'error') {
				processResponse(response.data, $scope,$scope.themeForm);
			}else{
				processResponse(response.data, $scope, $scope.themeForm);				
				if(isRedirect){
				$scope.redirect('video/video-manage/'+$routeParams.video_id+'/embedcode');
				}
			}
		});		
		
	}
	$scope.applyTheme = function(themeId){
		var actionUrl = baseUrl +'app/playertheme_ctrl/apply_theme';
		var data = $.param({
				'theme_id': themeId,
				'video_id': video_id
			});
		
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : data,
			headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
		})
		.then(function(response) {
			processResponse(response.data, $scope);
		});
	}
	$scope.setDefaultTheme = function(themeId){
		var actionUrl = baseUrl +'api/video/playertheme/setdefault_theme';
		var data = $.param({
				'theme_id': themeId
			});
		
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : data,
			headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
		})
		.then(function(response) {
			processResponse(response.data, $scope);
		});
	}
	$scope.deleteTheme = function(themeId){
		var actionUrl = baseUrl +'app/playertheme_ctrl/delete_theme';
		var data = $.param({
				'theme_id': themeId
			});
		
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : data,
			headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
		})
		.then(function(response) {
			processResponse(response.data, $scope);
		});
	}
	
	$scope.changeSkin = function(){
		$scope.themeForm.isIframeLoaded = false;
		$scope.themeForm.thumbnail = $scope.playerThemes[$scope.themeForm.playerskin-1].thumbnail;
		$scope.iframeParams.playerskin = $scope.themeForm.playerskin;
	}
	$scope.resetController = function(){
		$scope.getPlayerThemes();
		$scope.iframeParams = {'themeId':'','playerskin':'', 'random' : new Date().getTime()};
		$scope.themeForm = {};
		$scope.isChangeLogo = false;
	}
	
	$("#cplayer").on('load', function(){
		if(!Object.keys($scope.themeForm).length){
			return;
		}
		 $timeout(function() {
			$scope.themeForm.isIframeLoaded = true;
		 }, 500);
	});	
	$("#playerlogo").on('change', function() {
		if (this.files && this.files[0]) {
			var file = this.files[0];
			if (typeof file.type !== "undefined" ? file.type.match(/^image\/(gif|png|jpeg)$/) : file.name.match(/\.(gif|png|jpe?g)$/i)) {
				var reader = new FileReader();
				reader.onload = function(e) {
					$timeout(function() {
						$scope.isChangeLogo = true;
					 }, 500);
					$scope.themeForm.logo = e.target.result;
					$scope.updateCPlayer();
				}
				reader.readAsDataURL(this.files[0]);
			}else{
				alert("File Type Not Allow");
				return
			}
		}
	});
	$scope.setElementsAllowed = function (element){
		var idx = $scope.themeForm.elementsallowed.indexOf(element);
		if (idx > -1){
			$scope.themeForm.elementsallowed.splice(idx, 1);
		}
		else{
			$scope.themeForm.elementsallowed.push(element);
		}
		$scope.updateCPlayer();
	};
	$scope.updateCPlayer = function (){
		var themeCtrl = document.getElementById("cplayer").contentWindow.angular.element("#themeCtrl").scope();
			themeCtrl.setTheme($scope.themeForm);
	}
	$scope.libraryAddThumbnail = function(){
		$scope.open_smart_library('image',$scope.addThumbnail)
	}
	$scope.addThumbnail = function(responce){
		$scope.themeForm.logo = responce.url;
		$scope.updateCPlayer();
	}
	$scope.reset = function(){
		$route.reload();
	}

}
var videoFrameCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal,$routeParams){
	
	$scope.iframeFrameId = '';
	var video_id = $routeParams.video_id;
	$scope.video_id = $routeParams.video_id;
	$scope.getPlayerFrame = function(){
		var actionUrl = baseUrl +'api/video/playerframe/get_player_frame?video_id='+video_id;
		$http({
			method  : 'POST',
			url     : actionUrl,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
			$scope.iframeParams = {'frameId':0,'random': new Date().getTime()};
			$scope.player_frame_id = response.data.player_frame_id;
			$scope.preview_frame_id = response.data.player_frame_id;
		});
	}
	$scope.getPlayerFrame();
	$scope.previewFrame = function(frameId){
		$scope.preview_frame_id = frameId;
	}
	$scope.applyFrame = function(isRedirect){	
		var actionUrl = baseUrl +'/api/video/playerframe/apply_frame';
		var data = $.param({
				'frame_id': $scope.preview_frame_id,
				'video_id': video_id
			});
		
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : data,
			headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
		})
		.then(function(response) {
			if (response.data.status == 'error') {
				processResponse(response.data, $scope);								
			}else{
				processResponse(response.data, $scope);	
				$scope.getPlayerFrame();			
				if(isRedirect){
				$scope.redirect('video/video-manage/'+$routeParams.video_id+'/embedcode');
				}
			}
			
		});
		
	}
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();

}
var videoThumbnailCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal,$routeParams){
	
	$scope.video_id = $routeParams.video_id;
	$scope.getCurrentTime = function (){
		var cplayerMainCtrl = document.getElementById("cplayer").contentWindow.angular.element("#mainCtrl").scope();
		return cplayerMainCtrl.currentTime;
	}
	$scope.getBreadCrumb = function() {		
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/video/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
	$scope.getThumbnail = function(){
		var queryStr = baseUrl +'api/video/video_thumbnail/index/'+$routeParams.video_id;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.thumbnail = response.data;	
		 $scope.thumbnail_url	= $scope.thumbnail.selected.thumbnail;		 
		});
	}
	$scope.getThumbnail();
	$scope.previewThumbnail = function(thumbnail_url){		
		$scope.thumbnail_url = thumbnail_url;
		var themeCtrl = document.getElementById("cplayer").contentWindow.angular.element("#themeCtrl").scope();
			themeCtrl.setTheme({thumbnail:cdnUrl+thumbnail_url});
	}
	
	
	$scope.applyThumbnail =  function(isRedirect){
		var actionUrl = baseUrl +'api/video/videos/update_thumbnail';		
		if($scope.thumbnail_url == undefined){
			sagNotify("Please Select Any Thumbnail","error");
			return;
		}
		var data = $.param({
				'url': $scope.thumbnail_url,
				'video_id': $scope.video_id
			});
		
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : data,
			headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
		})
		.then(function(response) {
			if (response.data.status == 'error') {
				processResponse(response.data, $scope);
			}else{
				processResponse(response.data, $scope);				
				if(isRedirect){
				$scope.redirect('video/video-manage/'+$routeParams.video_id+'/embedcode');
				}
			}
			$scope.getThumbnail();
		});
	}
	$scope.openLibrary = function(){						
		$scope.open_smart_library('image',$scope.insertThumbnail);
	}
	
	$scope.insertThumbnail = function(responce){				 
		var actionUrl = baseUrl +'api/video/video_thumbnail/insert_thumbnail';
		var formData = new FormData();
		//formData.append('callback', 'angular.element("#projectListCtrl").scope().getProjectList()');
		formData.append('video_id', $scope.video_id);
		formData.append('url', responce.url);
			
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
			$scope.getThumbnail();
		});	
		
	
	}
	$scope.deleteItemsConfirm = function(thumbanil_url){		
			var selected = thumbanil_url;
			deleteConfirm(function(){$scope.deleteItems(selected)},"Are you sure to delete Thumbnail?", 'Confirm Delete?');	
	}
	$scope.deleteItems = function(selected){
		var actionUrl = baseUrl +'api/video/video_thumbnail/delete_thumbnail'
		var formData = new FormData();		
		formData.append('thumbnail_url', selected);
		formData.append('video_id', $scope.video_id);
		$http({
			method  : 'POST',
			url     : actionUrl,
			data    : formData,
			headers : { 'Content-Type': undefined}
			})
		.then(function(response) {
				processResponse(response.data, $scope)
				$scope.getThumbnail();
		});
	}
	
	$scope.getScreenShot = function(){
		var mainCtrl = document.getElementById("cplayer").contentWindow.angular.element("#mainCtrl").scope();
		var currentTime = parseInt(mainCtrl.getVideoObj().currentTime);
		var queryStr = baseUrl +'api/video/video_thumbnail/getscreenshot/'+$routeParams.video_id+'?t='+currentTime;	
		$rootScope.loader++;
		$http.get(queryStr)
		.then(function(response){
			$rootScope.loader--;
			$scope.getThumbnail();
			processResponse(response.data, $scope);
		});	
	}
	
}

var reportCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){
	
	$rootScope.activeModule = {reports:true};
	
	$scope.reportType = $routeParams.type;
	$scope.reportTypeId = $routeParams.type_id;
	if($scope.reportType === undefined){
		$scope.reportType = 'business';	
	}
	if($scope.reportTypeId === undefined){
		$scope.reportTypeId = businessId;
	}	
	$scope.reportOverviewUrl = '/video/reports/overview/'+$scope.reportType+'/'+$scope.reportTypeId;
	$scope.reportLocationUrl = '/video/reports/location/'+$scope.reportType+'/'+$scope.reportTypeId;
	$scope.reportTechnologyUrl = '/video/reports/technology/'+$scope.reportType+'/'+$scope.reportTypeId;
	$scope.reportResultUrl = '/video/reports/results/'+$scope.reportType+'/'+$scope.reportTypeId;
	$scope.reportCompareUrl = '/video/reports/compare/'+$scope.reportType+'/'+$scope.reportTypeId;

}

var reportOverviewCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){
	$scope.traffic = {'data':[]};
	$scope.activeTab = 'overview';
	$scope.reportType = $routeParams.type;
	$scope.reportTypeId = $routeParams.type_id;
	$scope.linkType = $routeParams.type;	
	if($scope.linkType == 'business'){
		$scope.linkType = '/video/reports/overview/project';
		$scope.linkId   = 'project_id';
	}else if($scope.linkType == 'project'){
		$scope.linkType = '/video/reports/overview/video';
		$scope.linkId   = 'video_id';
	}else if($scope.linkType == undefined){
		$scope.linkType = 'video/reports/overview/project';
		$scope.linkId   = 'project_id';
	}	
	if($scope.projectParams == undefined) {
		$scope.projectParams = {
			fields:'',
			search_key:'',
			date_start:'',
			date_end:'',
			items_per_page:'10',
			current_page:1,
			order_by:'created_date',
			order_type:'desc',
			filter_by:''
		};
	}
	if($routeParams.type === 'business'){
		$scope.projectParams.business_id = $routeParams.type_id;
	}else if($routeParams.type === 'project'){
		$scope.projectParams.project_id  = $routeParams.type_id;
	}else if($routeParams.type === 'video'){
		$scope.projectParams.video_id  = $routeParams.type_id;
	}else{
		$scope.projectParams.business_id = businessId;
	}
	
	if($routeParams.type == 'business'){
		$scope.filtercountType = 'projects';
	}else if($routeParams.type == 'project'){
		$scope.filtercountType = 'videos';
	}else if($routeParams.type == undefined){
		$scope.filtercountType = 'projects';
	}
	if($routeParams.type == 'project'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}else if($routeParams.type == 'video'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}
	

	$scope.getProjectList = function(){
					
		if($scope.reportType == undefined) {
			$scope.reportType = 'business';
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
		$scope.updateDateFilter($scope.projectParams);
		$scope.projectParams.draw = $scope.draw++;
		
		var queryStr = baseUrl +'api/video/reports/detail_list',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});
		$scope.json_process = true;

		$http.get(queryStr)
		.then(function(response){
			$scope.json_process = false;
			response.data.data = appendChecked(response.data.data);
			$scope.projects = response.data;						
		});
	}
	
	$scope.getProjectList();
	
	$scope.getBasicDetail = function(){	
			
		var queryStr = baseUrl +'api/video/reports/basic_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
				queryStr += concate+key + '=' + value;
				concate = '&';
			}
		});
		if($scope.projectParams.basicDetailDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.basicDetailDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
			$scope.basic = response.data;
		});
	}
	$scope.$watch('projectParams.basicDetailDateRange', function() {
		$scope.getBasicDetail();
	});
	$scope.getBasicConversion = function(){		
		var queryStr = baseUrl +'api/video/reports/basic_report_conversion',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});
		$http.get(queryStr)
		.then(function(response){
		$scope.basicConversion = response.data;
		});
	}
	$scope.getBasicConversion();
	
	$scope.getTrafficDetail = function(){		
		var queryStr = baseUrl +'api/video/reports/traffic_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.TrafficDetailDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.TrafficDetailDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.traffic = response.data;
		});
	}
	$scope.$watch('projectParams.TrafficDetailDateRange', function() {
		$scope.getTrafficDetail();
	});
	$scope.filterCounts = function() {
		if($scope.filtercountType == undefined){
			return;
		}		
		var queryStr = baseUrl +'api/video/filter_counts/index/'+$scope.filtercountType;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.filter_counts = response.data.data;
		 $scope.selectPickerRefresh();
		});		
	};
	$scope.filterCounts();
	
	$scope.getBreadCrumb = function() {	
		if($scope.breadcrumb == undefined){
			return;
		}
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/'+ $scope.breadcrumb;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
	$scope.helpModalShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/help-modal.html',
				controller: 'reportOverviewCtrl',
				size: 'dialog-centered modal-help-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
	
}
var reportLocationCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){
	$scope.activeTab = 'location';
	$scope.reportType = $routeParams.type;
		$scope.reportTypeId = $routeParams.type_id;
		$scope.linkType = $routeParams.type;	
	if($scope.linkType == 'business'){
		$scope.linkType = '/video/reports/overview/project';
		$scope.linkId   = 'project_id';
	}else if($scope.linkType == 'project'){
		$scope.linkType = '/video/reports/overview/video';
		$scope.linkId   = 'video_id';
	}	
		if($scope.projectParams === undefined) {
			$scope.projectParams = {
				fields:'',
				search_key:'',
				date_start:'',
				date_end:'',
				items_per_page:'10',
				current_page:1,
				order_by:'created_date',
				order_type:'desc',
				filter_by:''
			};
		}
		if($routeParams.type === 'business'){
			$scope.projectParams.business_id = $routeParams.type_id;
		}
		else if($routeParams.type === 'project'){
			$scope.projectParams.project_id  = $routeParams.type_id;
		}
		else if($routeParams.type === 'video'){
			$scope.projectParams.video_id  = $routeParams.type_id;
		}
		if($routeParams.type == 'business'){
			$scope.filtercountType = 'projects';
		}else if($routeParams.type == 'project'){
			$scope.filtercountType = 'videos';
		}
		if($routeParams.type == 'project'){
			$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
		}else if($routeParams.type == 'video'){
			$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
		}
	$scope.getProjectList = function(){				
		if($scope.reportType === undefined) {
			$scope.reportType = 'business';
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
		$scope.updateDateFilter($scope.projectParams);
		$scope.projectParams.draw = $scope.draw++;
		
		var queryStr = baseUrl +'api/video/reports/detail_list',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});
		$scope.json_process = true;

		$http.get(queryStr)
		.then(function(response){
			$scope.json_process = false;
			response.data.data = appendChecked(response.data.data);
			$scope.projects = response.data;		
		});
	}
	$scope.getProjectList();
	$scope.getLocationReport = function(){		
		var queryStr = baseUrl +'api/video/reports/location_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.locationDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.locationDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.location = response.data;
		});
	}
	$scope.$watch('projectParams.locationDateRange', function() {
		$scope.getLocationReport();
	});
	$scope.filterCounts = function() {
		if($scope.filtercountType == undefined){
			return;
		}		
		var queryStr = baseUrl +'api/video/filter_counts/index/'+$scope.filtercountType;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.filter_counts = response.data.data;
		 $scope.selectPickerRefresh();
		});		
	};
	$scope.filterCounts();
	$scope.getBreadCrumb = function() {	
		if($scope.breadcrumb == undefined){
			return;
		}
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/'+ $scope.breadcrumb;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
	$scope.helpModalShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/help-modal.html',
				controller: 'reportLocationCtrl',
				size: 'dialog-centered modal-help-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
	
	
}
var reportTechnologyCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){
	$scope.activeTab = 'technology';
	$scope.reportType = $routeParams.type;
	$scope.reportTypeId = $routeParams.type_id;
	$scope.linkType = $routeParams.type;	
	if($scope.linkType == 'business'){
		$scope.linkType = '/video/reports/overview/project';
		$scope.linkId   = 'project_id';
	}else if($scope.linkType == 'project'){
		$scope.linkType = '/video/reports/overview/video';
		$scope.linkId   = 'video_id';
	}	
	if($scope.projectParams === undefined) {
		$scope.projectParams = {
			fields:'',
			search_key:'',
			date_start:'',
			date_end:'',
			items_per_page:'10',
			current_page:1,
			order_by:'created_date',
			order_type:'desc',
			filter_by:''
		};
	}
	if($routeParams.type === 'business'){
		$scope.projectParams.business_id = $routeParams.type_id;
	}else if($routeParams.type === 'project'){
		$scope.projectParams.project_id  = $routeParams.type_id;
	}else if($routeParams.type === 'video'){
		$scope.projectParams.video_id  = $routeParams.type_id;
	}
	if($routeParams.type == 'business'){
		$scope.filtercountType = 'projects';
	}else if($routeParams.type == 'project'){
		$scope.filtercountType = 'videos';
	}
	if($routeParams.type == 'project'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}else if($routeParams.type == 'video'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}
	$scope.getProjectList = function(){				
		if($scope.reportType == undefined) {
			$scope.reportType = 'business';
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
		$scope.updateDateFilter($scope.projectParams);
		$scope.projectParams.draw = $scope.draw++;
		
		var queryStr = baseUrl +'api/video/reports/detail_list',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});
		$scope.json_process = true;

		$http.get(queryStr)
		.then(function(response){
			$scope.json_process = false;
			response.data.data = appendChecked(response.data.data);
			$scope.projects = response.data;			
		});
	}
	$scope.getProjectList();
	$scope.getOpertingReport = function(){

		var queryStr = baseUrl +'api/video/reports/operating_system_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.operatingDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.operatingDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.operting = response.data;
		$scope.filterCounts();
		});
	}
	$scope.$watch('projectParams.operatingDateRange', function() {
		$scope.getOpertingReport();
	});
	$scope.getBrowserReport = function(){		
		var queryStr = baseUrl +'api/video/reports/browser_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.browserDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.browserDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.browser = response.data;
		});
	}
	$scope.$watch('projectParams.browserDateRange', function() {
		$scope.getBrowserReport();
	});	
	$scope.getDeviceReport = function(){
	
		var queryStr = baseUrl +'api/video/reports/device_report',concate = '?';		
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
		}
		});
		if($scope.projectParams.deviceDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.deviceDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.device = response.data;
		});
	}
	$scope.$watch('projectParams.deviceDateRange', function() {
		$scope.getDeviceReport();
	});	
	$scope.filterCounts = function() {
		if($scope.filtercountType == undefined){
			return;
		}		
		var queryStr = baseUrl +'api/video/filter_counts/index/'+$scope.filtercountType;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.filter_counts = response.data.data;
		 $scope.selectPickerRefresh();
		});		
	};
	$scope.filterCounts();
	$scope.getBreadCrumb = function() {	
		if($scope.breadcrumb == undefined){
			return;
		}
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/'+ $scope.breadcrumb;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
	$scope.helpModalShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/help-modal.html',
				controller: 'reportTechnologyCtrl',
				size: 'dialog-centered modal-help-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
	
}
var reportResultCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){	
	$scope.lead = {'data':[]};
	$scope.promo = {'data':[]};
	$scope.share = {'data':[]};
	$scope.conversion = {'data':[]};
	$scope.engagement = {'data':[]};
	$scope.activeTab = 'results';
	$scope.reportType = $routeParams.type;
	$scope.reportTypeId = $routeParams.type_id;
	$scope.linkType = $routeParams.type;	
	if($scope.linkType == 'business'){
		$scope.linkType = '/video/reports/overview/project';
		$scope.linkId   = 'project_id';
	}else if($scope.linkType == 'project'){
		$scope.linkType = '/video/reports/overview/video';
		$scope.linkId   = 'video_id';
	}	
	if($scope.projectParams === undefined) {
		$scope.projectParams = {
			fields:'',
			search_key:'',
			date_start:'',
			date_end:'',
			items_per_page:'10',
			current_page:1,
			order_by:'created_date',
			order_type:'desc',
			filter_by:''
		};
	}
	if($routeParams.type === 'business'){
		$scope.projectParams.business_id = $routeParams.type_id;
	}else if($routeParams.type === 'project'){
		$scope.projectParams.project_id  = $routeParams.type_id;
	}else if($routeParams.type === 'video'){
		$scope.projectParams.video_id  = $routeParams.type_id;
	}
	if($routeParams.type == 'business'){
		$scope.filtercountType = 'projects';
	}else if($routeParams.type == 'project'){
		$scope.filtercountType = 'videos';
	}
	if($routeParams.type == 'project'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}else if($routeParams.type == 'video'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}
	$scope.getProjectList = function(){				
		if($scope.reportType == undefined) {
			$scope.reportType = 'business';
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
		$scope.updateDateFilter($scope.projectParams);
		$scope.projectParams.draw = $scope.draw++;
		
		var queryStr = baseUrl +'api/video/reports/detail_list',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {		
			queryStr += concate+key + '=' + value;
			concate = '&';					
		});
		$scope.json_process = true;

		$http.get(queryStr)
		.then(function(response){
			$scope.json_process = false;
			response.data.data = appendChecked(response.data.data);
			$scope.projects = response.data;			
		});
	}
	$scope.getProjectList();
	$scope.getLeadConversion = function(){
		if($scope.projectParams){
		$scope.projectParams.conversion_type = 'lead';
		}
	
		var queryStr = baseUrl +'api/video/reports/conversion_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.leadConversionDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.leadConversionDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.lead = response.data;
		});
	}	
	$scope.$watch('projectParams.leadConversionDateRange', function() {
		$scope.getLeadConversion();
	});

	$scope.getPromoConversion = function(){	
		if($scope.projectParams){
			$scope.projectParams.conversion_type = 'promo';
			}	
		var queryStr = baseUrl +'api/video/reports/conversion_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.promoConversionDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.promoConversionDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.promo = response.data;
		});
	}
	$scope.$watch('projectParams.promoConversionDateRange', function() {
		$scope.getPromoConversion();
	});
	
	$scope.getShareConversion = function(){
		if($scope.projectParams){
			$scope.projectParams.conversion_type = 'share';
			}		
		var queryStr = baseUrl +'api/video/reports/conversion_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.shareConversionDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.shareConversionDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.share = response.data;
		});
	}
	$scope.$watch('projectParams.shareConversionDateRange', function() {
		$scope.getShareConversion();
	});
	 $scope.getConversion = function(){	
		if($scope.projectParams){
			$scope.projectParams.conversion_type = '';
			}		
		var queryStr = baseUrl +'api/video/reports/conversion_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});

		if($scope.projectParams.conversionDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.conversionDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.conversion = response.data;
		});
	} 
	$scope.$watch('projectParams.conversionDateRange', function() {
		$scope.getConversion();
	});

	$scope.getEngagementGraph = function(){
		
		var queryStr = baseUrl +'api/video/reports/engagment_report',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.projectParams.engageDateRange){
			var daterange = dateRangeStrtoTime($scope.projectParams.engageDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.engagement = response.data;
		});

	}
	$scope.$watch('projectParams.engageDateRange', function() {
		$scope.getEngagementGraph();
	});	
	$scope.filterCounts = function() {
		if($scope.filtercountType == undefined){
			return;
		}		
		var queryStr = baseUrl +'api/video/filter_counts/index/'+$scope.filtercountType;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.filter_counts = response.data.data;
		 $scope.selectPickerRefresh();
		});		
	};
	$scope.filterCounts();
	$scope.getBreadCrumb = function() {	
		if($scope.breadcrumb == undefined){
			return;
		}
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/'+ $scope.breadcrumb;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();	
	$scope.helpModalShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/help-modal.html',
				controller: 'reportResultCtrl',
				size: 'dialog-centered modal-help-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
}
var reportCompareCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){
	$scope.activeTab = 'compare';
	if($routeParams.type == 'project'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}else if($routeParams.type == 'video'){
		$scope.breadcrumb = $routeParams.type + '/' + $routeParams.type_id;
	}
	$scope.getProjectList = function(){
		$scope.reportType = $routeParams.type;
		$scope.reportTypeId = $routeParams.type_id;
		if($scope.projectParams === undefined) {
			$scope.projectParams = {

			};
		}
				
		if($scope.reportType === undefined) {
			$scope.reportType = 'business';
		}
		$timeout(function () {
			$('.selectpicker').selectpicker('refresh');
		});
		$scope.updateDateFilter($scope.projectParams);
		$scope.projectParams.draw = $scope.draw++;
		if($routeParams.type === 'business'){
			$scope.projectParams.business_id = $routeParams.type_id;
		}
		else if($routeParams.type === 'project'){
			$scope.projectParams.project_id  = $routeParams.type_id;
		}else{		
			$scope.redirect('video/reports');
		}
		
		var queryStr = baseUrl +'api/video/reports/compare_list',concate = '?';
		angular.forEach($scope.projectParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});
		$http.get(queryStr)
		.then(function(response){			
			$scope.projects = response.data;
			$scope.selectPickerRefresh(); 
		});
	}
	$scope.compare =  function(compare_no, compare_id){		
	
		if($routeParams.type == 'business'){
			$scope.compareType = 'project_id';
		}
		else if($routeParams.type == 'project'){
			$scope.compareType = 'video_id';
		}
		var queryStr = baseUrl +'api/video/reports/compare';
		object = {};
		object[$scope.compareType]= compare_id;	
		$http({
            method: 'POST',
            url: queryStr,
            data: $.param(object),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;' }
        })
		.then(function(response){
			if(compare_no == 1){
				$scope.compare_data_1 = response.data.data;
			}
			else if(compare_no == 2){
				$scope.compare_data_2 = response.data.data;
			}
		});
		
	}
	$scope.getBreadCrumb = function() {	
		if($scope.breadcrumb == undefined){
			return;
		}
		var queryStr = baseUrl +'api/video/item_data/breadcrumb/'+ $scope.breadcrumb;		
		$http.get(queryStr)
		.then(function(response){
		 $scope.breadcrumb = response.data;		 
		});		
	};
	$scope.getBreadCrumb();
	$scope.helpModalShow = function(){		
		var dialogInst = $uibModal.open({
				templateUrl: cdnUrl+'apps/video/html/help-modal.html',
				controller: 'reportCompareCtrl',
				size: 'dialog-centered modal-help-size',
				windowClass : 'show',
				backdropClass : 'show',
				scope: $scope,
				resolve: {
					selectedItem: function () {
						return $scope.item;
					}
				}
			});
			dialogInst.result.then(function(newItem){
				$scope.item = {};
			},
			function(){
				$scope.item = {};
			}
			
		);
	};
	
	
}

var graphCtrl = function($scope, $rootScope, $location,$timeout, $http, $uibModal, $routeParams){
	$scope.line1 = [];
	$scope.line2 = [];
	$scope.line3 = [];
	
	if($scope.activeTab == 'overview'){
		$scope.visitorData = [
			{
				"key": "Visitors",
				"values": $scope.line1
			},
			{
				"key": "Unique Visitors",
				"values": $scope.line2
			},
		];
		$scope.$watch('traffic', function() {
			$scope.line1 = [];
			$scope.line2 = [];
			angular.forEach($scope.traffic.data, function(value, key) {
				$scope.line1.push([new Date(value.new_date), value.visitors]);
				$scope.line2.push([new Date(value.new_date), value.unique_visitors]);
			});
			$scope.visitorData = [
				{
					"key": "Visitors",
					color: '#ffa500',
					"values": $scope.line1
				},
				{
					"key": "Unique Visitors",
					color: '#c80032',
					"values": $scope.line2
				},
			];
		});
	}
	
	if($scope.activeTab == 'results'){
		$scope.visitorDataLead = [
			{
				"key": "Visitors",
				"values": $scope.line1
			}
		];
	$scope.$watch('lead', function() {
		$scope.line1 = [];		
		angular.forEach($scope.lead.data, function(value, key) {
			$scope.line1.push([new Date(value.new_date), value.conversions]);			
		});
		$scope.visitorDataLead = [
			{
				"key": "Audience",
				color: '#ffa500',
				"values": $scope.line1
			}
			
		];
	});
	$scope.visitorDataPromo = [
		{
			"key": "Visitors",
			"values": $scope.line1
		}];
	$scope.$watch('promo', function() {
		$scope.line1 = [];		
		angular.forEach($scope.promo.data, function(value, key) {
			$scope.line1.push([new Date(value.new_date), value.conversions]);			
		});
		$scope.visitorDataPromo = [
			{
				"key": "Audience",
				color: '#ffa500',
				"values": $scope.line1
			}
			
		];
	});
	$scope.visitorDataShare = [
		{
			"key": "Visitors",
			"values": $scope.line1
		}];
	$scope.$watch('share', function() {
		$scope.line1 = [];		
		angular.forEach($scope.share.data, function(value, key) {
			$scope.line1.push([new Date(value.new_date), value.visitors]);			
		});
		$scope.visitorDataShare = [
			{
				"key": "Audience",
				color: '#ffa500',
				"values": $scope.line1
			}
			
		];
	});
	$scope.visitorDataConversion = [
		{
			"key": "lead",
			"values": $scope.line1
		},
		{
			"key": "promo",
			"values": $scope.line2
		},{
			"key": "share",
			"values": $scope.line3
		}];
		
	$scope.$watch('conversion', function() {
		$scope.line1 = [];
		$scope.line2 = [];
		$scope.line3 = [];		
		angular.forEach($scope.conversion.data, function(value, key) {
			if(value.conversion_type == 0){
			$scope.line1.push([new Date(value.new_date), value.conversions]);
			}
			if(value.conversion_type == 1){
				$scope.line2.push([new Date(value.new_date), value.conversions]);

			}	
			if(value.conversion_type == 2){
				$scope.line3.push([new Date(value.new_date), value.conversions]);
			}			
		});
		$scope.visitorDataConversion = [
			{
				"key": "lead",
				color: '#ffa500',
				"values": $scope.line1
			},
			{
				"key": "promo",
				color: '#ff0000',
				"values": $scope.line2
			},
			{
				"key": "share",
				color: '#00a400',
				"values": $scope.line3
			}
			
		];
	});
	
	$scope.visitorDataEngagement = [
		{
			"key": "Visitors",
			"values": $scope.line1
		}];
	$scope.$watch('engagement', function() {
		$scope.line1 = [];		
		angular.forEach($scope.engagement.data, function(value, key) {
			$scope.line1.push([new Date(value.new_date), value.visitors]);			
		});
		$scope.visitorDataEngagement = [
			{
				"key": "Audience",
				color: '#ffa500',
				"values": $scope.line1
			}
			
		];
	});
	
	}
	$scope.xAxisTickFormat = function(){
		return function(d){
			return d3.time.format('%d %b %y')(new Date(d));  //uncomment for date format
		}
	}
	$scope.yAxisTickFormat = function(){
		return function(d){
			return d3.format(',.1')(d);
		}
	}
}

var geoaCtrl = function($scope){
	require(["http://maps.google.com/maps/api/js?sensor=false"],function(){
	var locations = [
	{"country":"AE","latitude":"23.424076","longitude":"53.847818","name":"United Arab Emirates","views":"12","plays":"1"},
	{"country":"AF","latitude":"33.93911","longitude":"67.709953","name":"Afghanistan","views":"13","plays":"2"},
	{"country":"IN","latitude":"20.593684","longitude":"78.96288","name":"India","views":"14","plays":"3"},
	{"country":"JP","latitude":"36.204824","longitude":"138.252924","name":"Japan","views":"15","plays":"4"},
	{"country":"LK","latitude":"7.873054","longitude":"80.771797","name":"Sri Lanka","views":"16","plays":"5"},
	{"country":"MX","latitude":"23.634501","longitude":"-102.552784","name":"Mexico","views":"17","plays":"6"},
	{"country":"NP","latitude":"28.394857","longitude":"84.124008","name":"Nepal","views":"18","plays":"7"},
	{"country":"PK","latitude":"30.375321","longitude":"69.345116","name":"Pakistan","views":"19","plays":"8"},
	{"country":"US","latitude":"37.09024","longitude":"-95.712891","name":"United States","views":"20","plays":"9"},
	{"country":"ZA","latitude":"-30.559482","longitude":"22.937506","name":"South Africa","views":"12","plays":"10"},
	{"country":"ZW","latitude":"-19.015438","longitude":"29.154857","name":"Zimbabwe","views":"24","plays":"11"}
	];


    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 1,
      center: new google.maps.LatLng(-30.559482, 22.937506),  
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
	console.log(locations[i].latitude);
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
			var content = [
				  locations[i].name+'('+locations[i].country+'),',
				  'Views: ' + locations[i].views,
				  'Plays: ' + locations[i].plays,
				  '<a href="video/geo_c">click here</a>',
			].join('<br>');
			infowindow.setContent(content);
			infowindow.open(map, marker);
        }
      })(marker, i));
    }
  
  });
}
var geocCtrl = function($scope){
	require(["http://maps.google.com/maps/api/js?sensor=false"],function(){
	var locations = [
	{"country":"Telangana, India","latitude":"17.123184","longitude":"79.208824","name":"Telangana, India","views":"100","plays":"1"},
	{"country":"Madhya Pradesh, India","latitude":"23.473324","longitude":"77.947998","name":"Madhya Pradesh, India","views":"101","plays":"2"},
	{"country":"Haryana, India","latitude":"29.238478","longitude":"76.431885","name":"Haryana, India","views":"102","plays":"3"},
	{"country":"Chhattisgarh, India","latitude":"21.295132","longitude":"81.828232","name":"Chhattisgarh, India","views":"103","plays":"4"},
	{"country":"Haryana, India","latitude":"29.065773","longitude":"76.040497","name":"Haryana, India","views":"104","plays":"5"},
	{"country":"Bhitarwar, Madhya Pradesh, India","latitude":"25.794033","longitude":"78.116531","name":"Bhitarwar, Madhya Pradesh, India","views":"105","plays":"6"},
	{"country":"Maharashtra, India","latitude":"19.601194","longitude":"75.552979","name":"Maharashtra, India","views":"106","plays":"7"},
	{"country":"Tripura, India","latitude":"23.745127","longitude":"91.746826","name":"Tripura, India","views":"107","plays":"8"},
	{"country":"Chandoor, Telangana, India","latitude":"17.874857","longitude":"78.100815","name":"Chandoor, Telangana, India","views":"108","plays":"9"},
	{"country":"Karnataka, India","latitude":"15.317277","longitude":"75.71389","name":"Karnataka, India","views":"109","plays":"10"},
	{"country":"Kerala, India","latitude":"10.850516","longitude":"76.27108","name":"Kerala, India","views":"110","plays":"11"},
	{"country":"Uttar Pradesh, India","latitude":"28.207609","longitude":"79.82666","name":"Uttar Pradesh, India","views":"111","plays":"12"},
	{"country":"Assam, India","latitude":"26.244156","longitude":"92.537842","name":"Assam, India","views":"112","plays":"13"},
	{"country":"Maharashtra, India","latitude":"19.66328","longitude":"75.300293","name":"Maharashtra, India","views":"113","plays":"14"},
	{"country":"Tamil Nadu, India","latitude":"11.127123","longitude":"78.656891","name":"Tamil Nadu, India","views":"114","plays":"15"},
	{"country":"Karnataka, India","latitude":"15.317277","longitude":"75.71389","name":"Karnataka, India","views":"115","plays":"16"},
	{"country":"West Bengal, India","latitude":"22.978624","longitude":"87.747803","name":"West Bengal, India","views":"116","plays":"17"},
	{"country":"Gujarat, India","latitude":"22.309425","longitude":"72.13623","name":"Gujarat, India","views":"117","plays":"18"},
	{"country":"Odisha, India","latitude":"20.94092","longitude":"84.803467","name":"Odisha, India","views":"118","plays":"19"},
	{"country":"Rajasthan, India","latitude":"27.391277","longitude":"73.432617","name":"Rajasthan, India","views":"119","plays":"20"},
	{"country":"Himachal Pradesh, India","latitude":"32.084206","longitude":"77.571167","name":"Himachal Pradesh, India","views":"120","plays":"21"},
	];


    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: new google.maps.LatLng(20.593684, 78.96288),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    for (i = 0; i < locations.length; i++) {  
	console.log(locations[i].latitude);
      marker = new google.maps.Marker({
        position: new google.maps.LatLng(locations[i].latitude, locations[i].longitude),
        map: map
      });

      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
			var content = [
				  locations[i].name+'('+locations[i].country+'),',
				  'Views: ' + locations[i].views,
				  'Plays: ' + locations[i].plays,
				  '<a href="video/geo_c">click here</a>',
			].join('<br>');
			infowindow.setContent(content);
			infowindow.open(map, marker);
        }
      })(marker, i));
    }
  
  });
}
var dashboardListCtrl = function ($scope, $rootScope, $location,$timeout, $http, $uibModal){

	$rootScope.activeModule = {'dashboard':true};

	$scope.getBasicDetail = function(){ 
		if($scope.dashboardParams === undefined) {
			$scope.dashboardParams = {			
			
			};
		}
		$scope.updateDateFilter($scope.dashboardParams);

		var queryStr = baseUrl +'api/video/dashboard/dashboard_report',concate = '?';
		angular.forEach($scope.dashboardParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});

		if($scope.dashboardParams.VisitorDetailDateRange){
			var daterange = dateRangeStrtoTime($scope.dashboardParams.VisitorDetailDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}

		$http.get(queryStr)
		.then(function(response){
		$scope.basic = response.data.data;
		});
	}

	$scope.$watch('dashboardParams.VisitorDetailDateRange', function() {
		$scope.getBasicDetail();
	});



	$scope.getLeadConversion = function(){
		if($scope.dashboardParams === undefined) {
			$scope.dashboardParams = {			
			
			};
		}
		$scope.updateDateFilter($scope.dashboardParams);

		var queryStr = baseUrl +'api/video/dashboard/conversion_report',concate = '?';

		angular.forEach($scope.dashboardParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});

		if($scope.dashboardParams.ConversionDetailDateRange){
			var daterange = dateRangeStrtoTime($scope.dashboardParams.ConversionDetailDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.conversion = response.data.data;
		});
	}	

	$scope.$watch('dashboardParams.ConversionDetailDateRange', function() {
		$scope.getLeadConversion();
	});




	$scope.getTrafficDetail = function(){	
		if($scope.dashboardParams === undefined) {
			$scope.dashboardParams = {			
			
			};
		}

		$scope.updateDateFilter($scope.dashboardParams);

		var queryStr = baseUrl +'api/video/dashboard/traffic_report',concate = '?';
		angular.forEach($scope.dashboardParams, function(value, key) {
			if(key != 'date_start' && key != 'date_end'){
			queryStr += concate+key + '=' + value;
			concate = '&';
			}
		});
		if($scope.dashboardParams.TrafficDetailDateRange){
			var daterange = dateRangeStrtoTime($scope.dashboardParams.TrafficDetailDateRange);
			queryStr += concate+'date_start=' +daterange.date_start;
			queryStr += concate+'date_end=' + daterange.date_end;
		}
		$http.get(queryStr)
		.then(function(response){
		$scope.traffic = response.data;
		});
	}

	$scope.$watch('dashboardParams.TrafficDetailDateRange', function() {
		$scope.getTrafficDetail();
	});



}
geoaCtrl.$inject = ['$scope'];
mainApp.register.controller('geoaCtrl', geoaCtrl);
geocCtrl.$inject = ['$scope'];
mainApp.register.controller('geocCtrl', geocCtrl);


/* controller registration*/
videoAppCtrl.$inject = ['$scope', '$rootScope', '$location','$timeout'];
mainApp.register.controller('videoAppCtrl', videoAppCtrl);

projectListCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('projectListCtrl', projectListCtrl);
projectCreateCtrl.$inject = ['$scope','$rootScope', '$uibModalInstance', 'selectedItem', '$log'];
mainApp.register.controller('projectCreateCtrl', projectCreateCtrl);
modelProjectSelectCtrl.$inject = ['$scope','$rootScope', '$uibModalInstance', 'selectedItem', '$log'];
mainApp.register.controller('modelProjectSelectCtrl', modelProjectSelectCtrl);


videoListCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('videoListCtrl', videoListCtrl);
videoCreateCtrl.$inject = ['$scope','$rootScope', '$uibModalInstance','$http', 'selectedItem', '$log', 'form'];
mainApp.register.controller('videoCreateCtrl', videoCreateCtrl);

videoDetailCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams','form'];
mainApp.register.controller('videoDetailCtrl', videoDetailCtrl);
videoEmbedCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams','form'];
mainApp.register.controller('videoEmbedCtrl', videoEmbedCtrl);

videoPlayerCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('videoPlayerCtrl', videoPlayerCtrl);
videoFrameCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('videoFrameCtrl', videoFrameCtrl);
videoThumbnailCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('videoThumbnailCtrl', videoThumbnailCtrl);

videoSubtitleCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams','form'];
mainApp.register.controller('videoSubtitleCtrl', videoSubtitleCtrl);

playerThemeCtrl.$inject = ['$scope', '$http', '$timeout', '$compile', '$route', '$routeParams','form'];
mainApp.register.controller('playerThemeCtrl', playerThemeCtrl);

videoAdvertiseCtrl.$inject = ['$scope','$rootScope','$route', '$location','$timeout','$interval', '$http','$uibModal', '$routeParams','form'];
mainApp.register.controller('videoAdvertiseCtrl', videoAdvertiseCtrl);
videoUpdateAdvertiseCtrl.$inject = ['$scope','$rootScope', '$uibModalInstance','$interval', 'selectedItem', '$log', 'form'];
mainApp.register.controller('videoUpdateAdvertiseCtrl', videoUpdateAdvertiseCtrl);

reportCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('reportCtrl', reportCtrl);
reportCompareCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('reportCompareCtrl', reportCompareCtrl);
reportLocationCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('reportLocationCtrl', reportLocationCtrl);
reportOverviewCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('reportOverviewCtrl', reportOverviewCtrl);
reportResultCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('reportResultCtrl', reportResultCtrl);
reportTechnologyCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('reportTechnologyCtrl', reportTechnologyCtrl);

graphCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('graphCtrl', graphCtrl);

uploadVideosCtrl.$inject = ['$scope', '$rootScope', '$location','$timeout','$interval', '$http', 'form'];
mainApp.register.controller('uploadVideosCtrl', uploadVideosCtrl);
replaceVideosCtrl.$inject = ['$scope', '$rootScope','$route', '$location','$timeout','$interval','$http', '$routeParams','form'];
mainApp.register.controller('replaceVideosCtrl', replaceVideosCtrl);


dashboardListCtrl.$inject = ['$scope','$rootScope', '$location','$timeout', '$http','$uibModal', '$routeParams'];
mainApp.register.controller('dashboardListCtrl', dashboardListCtrl);


// jquery extend function
$.extend(
{
    redirectPost: function(location, args)
    {
        var form = '';
        $.each( args, function( key, value ) {
            value = value.split('"').join('\"')
            form += '<input type="hidden" name="'+key+'" value="'+value+'">';
        });
        $('<form action="' + location + '" method="POST">' + form + '</form>').appendTo($(document.body)).submit();
    }
}); 


// $scope.send_url = baseUrl+'video/editor/video/'+video_id;
			// $scope.redirect_url = baseUrl+'video/publish/video/'+video_id;
			// $scope.redirect_data = '';
			// $.redirectPost($scope.send_url, {'redirect_url':$scope.redirect_url,'redirect_data':$scope.redirect_data}); 

