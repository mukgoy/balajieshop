/* controller */
mainApp.controller('mainCtrl', function($scope, $rootScope, $http, $location, $timeout, $sce, form) {
	$rootScope.activeLoaderCount = 0;
	$rootScope.baseUrl = baseUrl;
	$rootScope.cdnUrl = cdnUrl;
	$rootScope.title = 'Balajieshop';
	
	$rootScope.userdata = '';
	$rootScope.cart = {};
	
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

	$scope.getUserData = function(){
		$http.get(baseUrl+"api/frontend/user/get_userdata")
		.then(function(response){
			if(response.data){
				$rootScope.userdata = response.data;
				$scope.getCart();
			}
		});
	};
	$scope.getUserData();
	
	$scope.isExistInCart = function(product_variant_id){
		if($rootScope.cart.length > 0){
			return $rootScope.cart.some(function(el){
				console.log(el.product_variant_id == product_variant_id);
				return el.product_variant_id == product_variant_id
			});
		}
	}
	$scope.addOneMoreInCart = function(product_variant_id){
		if($rootScope.cart.length > 0){
			var cartProduct = $rootScope.cart.find(function(el){
				console.log(el.product_variant_id == product_variant_id);
				if(el.product_variant_id == product_variant_id){
					return el;
				}
			});
			console.log(cartProduct);
			$scope.updateCartQuantity(cartProduct.order_product_id, parseInt(cartProduct.qty)+1);
		}
	}
	$scope.addToCart = function(product_variant_id){
		if($rootScope.userdata.user_id){
			var postdata = {
				'user_id'			: $rootScope.userdata.user_id,
				'product_variant_id': product_variant_id,
			};
			form.submit(baseUrl+"api/frontend/cart/addtocart", postdata)
			.then(function(response) {
				$rootScope.cart = response.data;	
			});
		}else{
			loginBoxOpen();
		}
	};
	$scope.getCart = function(){
		var postdata = {
			'user_id'			: $rootScope.userdata.user_id
		};
		form.submit(baseUrl+"api/frontend/cart/getcart", postdata)
		.then(function(response) {
			$rootScope.cart = response.data;
		});
	};
	$scope.getCartTotlaPrice = function(){
		totalcartprice = 0;
		angular.forEach($rootScope.cart, function(value, key) {
			totalcartprice += value.qty*value.sell_price;
		});
		return totalcartprice;
	};
	$scope.updateCartQuantity = function(order_product_id, qty){
		console.log(qty);
		if(qty==null){return;}
		var postdata = {
			'user_id'			: $rootScope.userdata.user_id,
			'order_product_id'	: order_product_id,
			'qty'				: qty,
		};
		form.submit(baseUrl+"api/frontend/cart/update_cart_quantity", postdata)
		.then(function(response) {
			$rootScope.cart = response.data;	
		});
	};
	
});

mainApp.controller('appCtrl', function($scope, $http, $compile) {
    
});

mainApp.controller('headerCtrl', function($scope, $rootScope, $http, $compile, form) {
	$scope.search_key = '';
	$scope.search_autocomplete = function(){
		$scope.draw++;
		$http.get(baseUrl+"api/frontend/products/search_autocomplete?search_key="+$scope.search_key)
		.then(function(response){
			$scope.search_autocomplete_data = response.data;		
		});
	}
	
	$scope.getBrands = function(){
		$http.get(baseUrl+"api/frontend/get/brands")
		.then(function(response){
			$scope.brands = response.data;
			$scope.selectPickerRefresh();
		});
	};
	$scope.getBrands();
	
	$scope.filter = {
		price_start: 0,
		price_end: 10000,
		brands : [],
	};
	
	$scope.resetFilters = function(){
		$scope.filter = {
			price_start: 0,
			price_end: 10000,
			brands : [],
		};
		$scope.selectPickerRefresh();
	};
	
	$scope.applyFilters = function(){
		angular.element("#productListCtrl").scope().getProductList();
	};
	
	$scope.isLogin = false;
	$scope.register = {
		name:'',
		email:'',
		password:'',
		cpassword:'',
		
	};
	
	$scope.login = {
		email:'',
		password:'',
	};
	
	$scope.optemail = {
		email:'',
		otp_email:'',
	};
	
	$scope.registerSubmit = function(){
		form.submit(baseUrl+"api/frontend/user/register", $scope.register)
		.then(function(response) {
			processResponse($scope, $scope.register, response.data);
			$(".register-box").fadeOut()
			$(".otp-email-box").fadeIn();
			$scope.optemail.email = $scope.register.email;
		});
	};
	
	$scope.loginSubmit = function(){
		form.submit(baseUrl+"api/frontend/user/login", $scope.login)
		.then(function(response) {
			processResponse($scope, $scope.login, response.data);
			if(response.data.status == 'success'){
				$(".canvas-box").fadeOut();
				$(".main-box").fadeIn();
				$(".main-view").fadeIn();
				$("#footer").fadeIn();
				$scope.getUserData();
			}
		});
	};
	
	$scope.otpEmailResend = function(){
		form.submit(baseUrl+"api/frontend/user/resend_otp_email", $scope.optemail)
		.then(function(response) {
			processResponse($scope, $scope.register, response.data);
		});
	};
	
	$scope.otpEmailSubmit = function(){
		form.submit(baseUrl+"api/frontend/user/verify_otp_email", $scope.optemail)
		.then(function(response) {
			processResponse($scope, $scope.optemail, response.data);
			
			if(response.data.status == 'success'){
				// $(".otp-email-box").fadeOut();
				$(".canvas-box").fadeOut();
				$(".main-box").fadeIn();
				$(".main-view").fadeIn();
				$("#footer").fadeIn();
			}
			
		});
	};

});

mainApp.controller('productListCtrl', function($scope, $rootScope, $http, $compile, $routeParams, form) {
    $scope.getProductList = function(){
		if($scope.productParams === undefined) {
			$scope.productParams = {
				search_key:getUrlParam('search_key',''),
				items_per_page:'10',
				current_offset:1,
				order_by:'popularity',
				order_type:'desc'
			};
		}
		
		$scope.productParams.price_start = angular.element("#headerCtrl").scope().filter.price_start;
		$scope.productParams.price_end = angular.element("#headerCtrl").scope().filter.price_end;
		$scope.productParams.brands = angular.element("#headerCtrl").scope().filter.brands;
		
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

mainApp.controller('checkoutCtrl', function($scope, $rootScope, $http, $compile, $routeParams, form) {
    $scope.getProductList = function(){
		if($scope.productParams === undefined) {
			$scope.productParams = {
				search_key:getUrlParam('search_key',''),
				items_per_page:'10',
				current_offset:1,
				order_by:'popularity',
				order_type:'desc'
			};
		}
		
		$scope.productParams.price_start = angular.element("#headerCtrl").scope().filter.price_start;
		$scope.productParams.price_end = angular.element("#headerCtrl").scope().filter.price_end;
		$scope.productParams.brands = angular.element("#headerCtrl").scope().filter.brands;
		
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


