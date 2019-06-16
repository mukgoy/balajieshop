/* controller */
mainApp.controller('mainCtrl', function ($scope, $http, $uibModal, $timeout, $compile, $location) {
	$('.loader').fadeOut("slow");
	$scope.baseUrl = baseUrl;
	$scope.cdnUrl = cdnUrl;
	$scope.backend = 'backend/';
	$scope.draft = 1;
	$scope.categories1 = "";
	$scope.categories2 = "";
	$scope.categories3 = "";
	$scope.areas = "";
	$scope.brands = "";
	$scope.getlist = function(listName){
		$scope.categories1 = "";
		$http.get(baseUrl+'api/backend/getlist/'+listName, { cache: true })
		.then(function(response){
			$scope[listName] = response.data;
			$timeout(function () {
				$(".selectpicker").selectpicker('refresh');
			});
		 });
	}
	
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

mainApp.controller("productCategoryCtrl", function($scope,$http,$window) {
	$scope.title = "Products-Category";
	$scope.products = [];
	$scope.getProducts = function(){
		if($scope.params === undefined){
			$scope.params = {
				search 		: '',
				items_per_page 	: '10',
				current_page	: 1,
				order_by		: 'modified',
				order_type		: 'desc',
			}
		}
		apiUrl = baseUrl+'api/backend/product_categories?draft='+$scope.draft;
		angular.forEach($scope.params, function(value, key){
			apiUrl += '&'+key+'='+value;
		});
		$http({url:apiUrl})
		.then(function(response){
			$scope.products = response.data;
		});
	}
	$scope.getProducts();
	
	$scope.updateStatus = function(product){
		apiUrl = baseUrl+'api/backend/product_categories/update_status?product_id='+product.product_id+'&status='+product.status;
		$http({url:apiUrl})
		.then(function(response){
			processResponse($scope, product, response.data);
		});
	}
	
});

mainApp.controller('productModelCategoryCtrl', function ($scope, $uibModalInstance, form, resolve) {
	if(resolve.ngData==undefined){
		$scope.product = {title:'',brand_id:'',cat1_id:'',cat2_id:'',cat3_id:'',popularity:''};
	}else{
		$scope.product = resolve.ngData;
	}

	$scope.ngOk = function (formScope) {
		form.submit(baseUrl +'api/backend/product_categories/'+resolve.ngKey, formScope).then(function(response){
			processResponse($scope, formScope, response.data);
			if(response.data.status == 'success') {
				$scope.getProducts();
				$uibModalInstance.close({formScope:formScope, response:response.data});
			}
		});
		
	}
	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});

mainApp.controller("productVarientsCtrl", function($scope,$http,$window,$routeParams) {
	
	$scope.title = "Product-Varients";
	$scope.product_id = $routeParams.product_id;
	$scope.varients = [];
	$scope.getProductVarients = function(){
		apiUrl = baseUrl+'api/backend/product_varients/index/'+$routeParams.product_id+'?draft='+$scope.draft;
		$http({url:apiUrl})
		.then(function(response){
			$scope.varients = response.data.data;
		});
	}
	$scope.getProductVarients();
	
	$scope.updateStatus = function(variant){
		apiUrl = baseUrl+'api/backend/product_varients/update_status?product_variant_id='+variant.product_variant_id+'&status='+variant.status;
		$http({url:apiUrl})
		.then(function(response){
			processResponse($scope, variant, response.data);
		});
	}
	
  
});

mainApp.controller('productModelVarientCtrl', function ($scope, $uibModalInstance, form, resolve) {
	if(resolve.ngData.variant_title==undefined){
		$scope.variant = {
			product_id:resolve.ngData.product_id,
			variant_title:'',
			mrp:'',buy_price:'',sell_price:'',
			discount_title:''
		};
	}else{
		$scope.variant = resolve.ngData;
	}

	$scope.ngOk = function (formScope) {
		console.log(formScope);
		form.submit(baseUrl +'api/backend/product_varients/'+resolve.ngKey, formScope).then(function(response){
			processResponse($scope, formScope, response.data);
			if(response.data.status == 'success') {
				$scope.getProductVarients();
				//$uibModalInstance.close({formScope:formScope, response:response.data});
			}
			
		});
		
	}
	$scope.cancel = function () {
		$scope.getProductVarients();
		$uibModalInstance.dismiss('cancel');
	};
});


