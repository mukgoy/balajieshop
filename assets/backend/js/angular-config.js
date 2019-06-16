mainApp.config(function($routeProvider, $locationProvider, $sceDelegateProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

	mainApp.register = {
		controller: $controllerProvider.register,
		directive: $compileProvider.directive,
		filter: $filterProvider.register,
		factory: $provide.factory,
		service: $provide.service
	};
	var route = routeResolverProvider.route;
	
	$routeProvider
	.when("/backend/product-category", route.resolve({templateUrl:'assets/backend/html/products/product-category.html'}))
	.when("/backend/product-varients/:product_id", route.resolve({templateUrl:'assets/backend/html/products/product-varients.html'}))
	// .when("/backend/product-varients", route.resolve({templateUrl:'assets/backend/html/products/product-varients1.html'}))
	.otherwise({redirectTo: "/backend/product-category"});
		
	$locationProvider.html5Mode(true);
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',baseUrl,cdnUrl
	]);
});

