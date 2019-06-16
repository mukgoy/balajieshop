/* controller */
mainApp.controller('mainCtrl', function ($scope, $http, $compile, $location) {
	$scope.init = function (items){
		isInit = true;
		angular.forEach(items, function (value, key) {
			$scope[key] = value;
		});
	}
	
	$scope.isFormProcessing = false;
	
	$scope.processForm = function(actionUrl, formScope, isResetForm = 0){
		formDataObj = removeHashKey(formScope);
		console.log(formDataObj);
		$scope.isFormProcessing = true;
		$http({
			method  : 'POST',
			url     : actionUrl,
			transformRequest: function (data) {
				var formData = new FormData();
				angular.forEach(data, function (value, key) {
					if(key == 'file'){
						$.each(value, function(fileKey, fileValue) {
							for (var i = 0; i < value[fileKey].length; i++) {
								formData.append(fileKey, value[fileKey][i]);
							}
						});
					}
					if(key == 'mfile'){
						$.each(value, function(fileKey, fileValue) {
							for (var i = 0; i < value[fileKey].length; i++) {
								formData.append(fileKey+'[]', value[fileKey][i]);
							}
						});
					}
				});
				angular.forEach(createNextedParam(data), function (item){
					formData.append(item.key, item.val);
				});
				return formData;
			},
			data: formDataObj,
			headers : { 'Content-Type': undefined}
		})
		.then(function(response) {
			var data = response.data;
			$scope.isFormProcessing = false;
			processResponse($scope, formScope, data);
			if (!data.error && isResetForm) {
				resetForm(formDataObj);
			}
		});
	};
		
	$scope.$watch('isFormProcessing', function(){
		if(!$scope.isFormProcessing){
			var replacementText = $(clickOnce).attr('click-once');
			if (replacementText) {
				$(clickOnce).html(replacementText);
			}
            $(clickOnce).attr('disabled', false);
		}
	});

	$scope.isAllSelected = function(list){
		return list.length && list.every(function(item){return item.checked;});
	};
	$scope.toggleAll = function(list, allChecked){
		angular.forEach(list, function(item){ item.checked = allChecked; });
	};
	$scope.toggleCheckBoxSelection = function(options, item) {
		var idx = options.indexOf(item);
		if (idx > -1) {	
			options.splice(idx, 1);
		}else {
			options.push(item);
		}
	};
  
	$scope.redirect = function(url){
		$location.path(url).replace();
	};
	
	$scope.addMore = function(formModel){
		if(typeof formModel[0] == 'object'){
			formModel.push({});
		}
		else{
			formModel.push('');
		}
		
	};
	$scope.removeThis = function(formModel, index) {
		formModel.splice(index, 1);
	}
});
mainApp.controller('appCtrl', function ($scope, $http, $compile) {


});





