mainApp.config(function($routeProvider, $locationProvider, $sceDelegateProvider) {

	$routeProvider
	.when("/", 						{templateUrl : "assets/html/products/list.html"})
	.when("/login", 				{templateUrl : "assets/html/products/list.html"})
	.when("/signup", 				{templateUrl : "assets/html/products/list.html"})
	.when("/forgot-password", 		{templateUrl : "assets/html/products/list.html"})
	.when("/reset-password", 		{templateUrl : "assets/html/products/list.html"})
	.when("/products/:cat_type/:cat_slug", {templateUrl : "assets/html/products/list.html"})
	.otherwise({redirectTo: "/"});
	
	
	$locationProvider.html5Mode(true);
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',baseUrl,cdnUrl,
		'https://test.s3.amazonaws.com/**',
		'http://www.test.com/**'
	]);
});

