/* controller */
define(["app","angular-directive","angular-filter", "angular-helper"], function(app) {
    app.controller("mainCtrl", function($scope,$uibModal,$http,$timeout) {
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
		

    });
	
	app.controller("productCategoryCtrl", function($scope,$http,$window) {
		$scope.title = "products-list";
		$scope.products = [];
		$scope.getProducts = function(){
			if($scope.params === undefined){
				$scope.params = {
					search_key 		: '',
					items_per_page 	: 10,
					current_page	: 1,
					order_by		: 'modified',
					order_type		: 'desc',
				}
			}
			apiUrl = baseUrl+'api/backend/Product_categories?draft='+$scope.draft;
			angular.forEach($scope.params, function(value, key){
				apiUrl += '&'+key+'='+value;
			});
			$http({url:apiUrl})
			.then(function(response){
				$scope.products = response.data;
			});
		}
		$scope.getProducts()
		
		$scope.modelclose = function(data){
			processResponse($scope, data.formScope, data.response);
		};
    });

	app.controller('productModelCategoryCtrl', function ($scope, $uibModalInstance, form, ngData) {
		if(ngData==undefined){
			$scope.product = {title:'',brand_id:'',cat1_id:'',cat2_id:'',cat3_id:'',popularity:''};
		}else{
			$scope.product = ngData;
		}
		$scope.ok = function (formScope) {
			form.submit(baseUrl +'api/backend/Product_categories/add',formScope).then(function(response){
				if(response.data.status == 'success') {
					$uibModalInstance.close({formScope:formScope, response:response.data});
				}else{
					processResponse($scope, formScope, response.data);
				}
			});
			
		}
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
		$scope.testt = function () {
			console.log($scope);
		};
	});
	
	app.controller("productVarientsCtrl", function($scope,$http,$window) {
		$scope.title = "products-list";
		$scope.products = [];
		$scope.getProducts = function(){
			if($scope.params === undefined){
				$scope.params = {
					search_key 		: '',
					items_per_page 	: 10,
					current_page	: 1,
					order_by		: 'modified',
					order_type		: 'desc',
				}
			}
			apiUrl = baseUrl+'api/backend/products?draft='+$scope.draft;
			angular.forEach($scope.params, function(value, key){
				apiUrl += '&'+key+'='+value;
			});
			//alert(apiUrl);
		}
		$scope.getProducts()
		
		$scope.modelclose = function(newdata){
			alert(newdata);
		};
    });
	
	

});


