mainApp.config(function($routeProvider, $locationProvider, $sceDelegateProvider, routeResolverProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

	mainApp.register = {
		controller: $controllerProvider.register,
		directive: $compileProvider.directive,
		filter: $filterProvider.register,
		factory: $provide.factory,
		service: $provide.service
	};
	var route = routeResolverProvider.route;
	var resp = checkCurrentUrlContainSubdomain();
	if(resp){
		var current_page = 'login.html';
		var current_dashboard_page = 'dashboard.html';
	}
	else{
		var current_page = 'login-subdomain.html';	
		var current_dashboard_page = 'dashboard-subdomain.html';	
		 
	}
	
	
	
	$routeProvider
	//routes Start for Smart
	.when("/login", 				route.resolve('login/'+current_page,'smart'))
	.when("/forgot-password", 		route.resolve('login/forgot-password.html','smart'))
	.when("/otp-password", 			route.resolve('login/forgot-password.html','smart'))
	.when("/reset-password", 		route.resolve('login/reset-password.html','smart'))
	.when("/signup", 				route.resolve('signup/signup.html','smart'))
	.when("/otp-verification", 		route.resolve('signup/otp.html','smart'))
	.when("/business-list1", 		route.resolve('businesses/business-list1.html','smart'))
	.when("/account-merge", 		route.resolve('accounts/smart-account-merge.php','smart'))
	.when("/business-step1", 		route.resolve('signup/business-step1.html','smart'))
	.when("/business-step2", 		route.resolve('signup/business-step2.html','smart'))
	.when("/congratulations", 		route.resolve('signup/congratulations.html','smart'))
	.when("/dashboard", 		route.resolve('dashboard/'+current_dashboard_page,'smart'))
	.when("/all-businesses", 		route.resolve('businesses/business_list.html','smart'))
	.when("/logout", 		route.resolve('login/logout.html','smart'))
	.when("/create-business-step1", 		route.resolve('businesses/business-step1.html','smart'))
	.when("/create-business-step2", 		route.resolve('businesses/business-step2.html','smart'))
	.when("/congratulation", 		route.resolve('businesses/congratulations.html','smart'))
	.when("/user-profile", 		route.resolve('saglus-account-settings/user-profile.html','smart'))
	.when("/library", 		route.resolve('library/library.html','smart'))

	
	.when("/all-blog", 		route.resolve('blog/all-blog.html','cms'))
	.when("/all-comments", 		route.resolve('blog/all-comments.html','cms'))
	.when("/categories", 		route.resolve('blog/categories.html','cms'))
	.when("/create-blog", 		route.resolve('blog/create-blog.html','cms'))
	.when("/create-category", 		route.resolve('blog/create-categories.html','cms'))
	.when("/blog-dashboard", 		route.resolve('blog/dashboard.html','cms'))
	.when("/revision-history", 		route.resolve('blog/revision-history.html','cms'))
	.when("/single-comment", 		route.resolve('blog/single-comment.html','cms'))
	.when("/edit-blog", 		route.resolve('blog/edit-blog.html','cms'))
	.when("/edit-category", 		route.resolve('blog/edit-category.html','cms'))
	
	//routes Start for video
	.when("/video/upload", 		route.resolve('videos/video-upload.html','video'))
	.when("/video/replace/:video_slug", 	route.resolve('videos/video-replace.html','video'))

	
	//routes Start for engage
	.when("/engage/segment-settings", 		route.resolve('segments/segment_settings.html','engage'))
	
	
	/* routes dafault*/
	.otherwise({redirectTo: "/login"});
	
	
	$locationProvider.html5Mode(true);
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',baseUrl,cdnUrl,
		'https://sagsmart-v1.0-dev.s3.amazonaws.com/**',
		'http://www.vidmozopro.com/**'
	]);
});

