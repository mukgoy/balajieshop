/* controller */
mainApp.controller('mainCtrl', function($scope, $rootScope, $http, $location, $timeout, $sce, form) {
	$rootScope.activeLoaderCount = 0;
	$rootScope.baseUrl = baseUrl;
	$rootScope.cdnUrl = cdnUrl;
	$rootScope.title = 'Balajieshop';
    $rootScope.redirect = function(path) {
        $location.path(path).replace();
    };
	
		
    /* chechbox select all*/
    $scope.isAllSelected = function(list) {
        return list.length && list.every(function(item) { return item.checked; });
    };
    $scope.isAnySelected = function(list) {
        return list.length && list.some(function(item) { return item.checked; });
    };
    $scope.toggleAll = function(list, allChecked) {
        angular.forEach(list, function(item) { item.checked = allChecked; });
    };
    $scope.toggleCheckBoxSelection = function(list, item) { //used to get list of only selected items
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    }

    /* add more btn / remove element */
    $scope.addMore = function(formModel) {
        if (typeof formModel[0] == 'object') {
            formModel.push({});
        } else {
            formModel.push('');
        }
        $timeout(function() {
            $('.selectpicker').selectpicker('refresh');
        });
    };
    $scope.removeThis = function(formModel, index) {
        formModel.splice(index, 1);
        $timeout(function() {
            $('.selectpicker').selectpicker('refresh');
        });
    }

    $scope.selectPickerRefresh = function(){
		$timeout(function () {
			$('.selectpicker').selectpicker({
				container: 'body'   
			});
			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
				$('.selectpicker').selectpicker('mobile');
			}
			$('.selectpicker').selectpicker('refresh');
		},50);
	}
	$scope.isArray = angular.isArray;
	
	$scope.trustAsHtml = function(string) {
		return $sce.trustAsHtml(string);
	};
	
	$scope.isActive = function(path){
		return $location.path() == path;
	};
	$rootScope.$on("$locationChangeStart", function(event, next, current) {
		$timeout(function(){
			$("a.active").parents('li').children('a').addClass("active");
		},50); 
    });
	
	$scope.getCategories = function(){
		form.submit(baseUrl+"api/frontend/get/categories")
		.then(function(response) {
			$scope.categories = response.data;
			$timeout(function(){
				$("a.active").parents('li').children('a').addClass("active");
			},50);
		});
	};
	$scope.getCategories();
	
});

mainApp.controller('appCtrl', function($scope, $http, $compile) {
    
});

mainApp.controller('headerCtrl', function($scope, $rootScope, $http, $compile) {
	$scope.search_key = '';
	$scope.search_autocomplete = function(){
		$scope.draw++;
		$http.get(baseUrl+"api/frontend/products/search_autocomplete?search_key="+$scope.search_key)
		.then(function(response){
			$scope.search_autocomplete_data = response.data;		
		});
	}
});

mainApp.controller('productListCtrl', function($scope, $rootScope, $http, $compile, $routeParams) {
    $scope.getProductList = function(){
		if($scope.productParams === undefined) {
			$scope.productParams = {
				search_key:getUrlParam('search_key',''),
				items_per_page:'10',
				current_offset:1,
				order_by:'popularity',
				order_type:'desc',
				price_start: 0,
				price_end: 10000,
				brands : [],
			};
		}
		if($scope.products === undefined) {
			$scope.products = {};
		}
		
		// $scope.productParams.draw = $scope.draw++;
		if($routeParams.cat_type != undefined && $routeParams.cat_slug != undefined){
			$scope.productParams.cat_type = $routeParams.cat_type;
			$scope.productParams.cat_slug = $routeParams.cat_slug;
			$rootScope.title = 'Balajieshop | '+$routeParams.cat_slug;
		}
		
		var queryStr = baseUrl +'api/frontend/products';
		var concate = '?';
		angular.forEach($scope.productParams, function(value, key) {
			queryStr += concate+key + '=' + value;
			concate = '&';
		});

		$http.get(queryStr)
		.then(function(response){
			$scope.products = response.data;		
		});
	}
	$scope.getProductList();
});


