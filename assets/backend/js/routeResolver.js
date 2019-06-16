var routeResolver = function () {

this.$get = function () {
	return this;
};



this.route = function (){
	var resolve = function (routeDef){
		//routeDef.secure = (secure) ? secure : false;
		routeDef.resolve = {
			load: ['$q', '$rootScope', function ($q, $rootScope){
				var dependencies = routeDef.dependencies;
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
}();

};   
mainApp.provider('routeResolver', routeResolver);

