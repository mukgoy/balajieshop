var routeResolver = function () {

this.$get = function () {
	return this;
};

this.routeConfig = function () {
	var viewsDirectory = cdnUrl+'apps/{appName}/html/',
		controllersDirectory = cdnUrl+'apps/{appName}/js/',
		getViewsDirectory = function (appName) {
			return viewsDirectory.replace("{appName}", appName);
		},
		getControllersDirectory = function (appName) {
			return controllersDirectory.replace("{appName}", appName);
		};
		return {
			getControllersDirectory: getControllersDirectory,
			getViewsDirectory: getViewsDirectory
		};
}();

this.route = function (routeConfig){
	var resolve = function (htmlFile, appName, controllerAs, secure) {
	if (!appName) appName = '';
		var routeDef = {};
		routeDef.templateUrl = routeConfig.getViewsDirectory(appName) + htmlFile;
		routeDef.controller = appName + 'AppCtrl';
		if (controllerAs) routeDef.controllerAs = controllerAs;
		routeDef.secure = (secure) ? secure : false;
		routeDef.resolve = {
			load: ['$q', '$rootScope', function ($q, $rootScope){
				
				if(appName == 'smart'){
				var dependencies = [
				
									routeConfig.getControllersDirectory(appName) + 'angular-controller.js',
									routeConfig.getControllersDirectory(appName) + 'angular-library-controller.js',
									routeConfig.getControllersDirectory(appName) + 'angular-directive.js',
									routeConfig.getControllersDirectory(appName) + 'angular-filter.js',
									routeConfig.getControllersDirectory(appName) + 'angular-helper.js'
									];
				}
				else{
					var dependencies = [
					
									routeConfig.getControllersDirectory(appName) + 'angular-controller.js',
									routeConfig.getControllersDirectory(appName) + 'angular-directive.js',
									routeConfig.getControllersDirectory(appName) + 'angular-filter.js',
									routeConfig.getControllersDirectory(appName) + 'angular-helper.js'
									];
					
				}
				return resolveDependencies($q, $rootScope, dependencies);
			}]
		};

		return routeDef;
	},

	resolveDependencies = function ($q, $rootScope, dependencies) {
		var defer = $q.defer();
		require(dependencies, function () {
			defer.resolve();
			$rootScope.$apply()
		});
		return defer.promise;
	};

	return {
		resolve: resolve
	}
}(this.routeConfig);

};   
mainApp.provider('routeResolver', routeResolver);

