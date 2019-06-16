define(["angularAMD", "angular-route","angular-sanitize",'ui.bootstrap','navigation'], function(angularAMD) {
    var app = angular.module("app", ["ngRoute",'ui.bootstrap','ngSanitize']);
    return app.config(["$routeProvider","$locationProvider","$sceDelegateProvider", function($routeProvider, $locationProvider, $sceDelegateProvider) {
        $routeProvider.when("/backend/product-varients", angularAMD.route({
            templateUrl: "assets/backend/html/products/product-varients.html",
			controllerUrl: "assets/backend/js/angular-controller.js",
            navTab: "products"
        }))
		.when("/backend/product-varients", angularAMD.route({
            templateUrl: "assets/backend/html/products/product-varients.html",
			controllerUrl: "assets/backend/js/angular-controller.js",
            navTab: "product-category"
        }))
		.when("/backend/product-category", angularAMD.route({
            templateUrl: "assets/backend/html/products/product-category.html",
			controllerUrl: "assets/backend/js/angular-controller.js",
            navTab: "product-category"
        }))

		.otherwise({
            redirectTo: "/backend/product-category"
        });
		
		$locationProvider.html5Mode(true);
		$sceDelegateProvider.resourceUrlWhitelist([
			'self',baseUrl,cdnUrl,
			'https://domain.com/**',
			'http://www.domain1.com/**'
		]);
	
    }]), 
	angularAMD.bootstrap(app)
});