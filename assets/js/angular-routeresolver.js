var routeResolver = function() {

    this.$get = function() {
        return this;
    };

    this.routeConfig = function() {
        var viewsDirectory = cdnUrl + 'apps/{appName}/html/',
            controllersDirectory = cdnUrl + 'apps/{appName}/js/',
            getViewsDirectory = function(appName) {
                return viewsDirectory.replace("{appName}", appName);
            },
            getControllersDirectory = function(appName) {
                return controllersDirectory.replace("{appName}", appName);
            };
        return {
            getControllersDirectory: getControllersDirectory,
            getViewsDirectory: getViewsDirectory
        };
    }();

    this.route = function(routeConfig) {
        var resolve = function(htmlFile, appName, controllerAs, secure) {
                if (!appName) appName = '';
                var routeDef = {};
                if (check_is_iibrary(window.location.href)) {
                    routeDef.templateUrl = routeConfig.getViewsDirectory('smart') + htmlFile;
                } else {
                    routeDef.templateUrl = routeConfig.getViewsDirectory(appName) + htmlFile;
                }
                routeDef.controller = appName + 'AppCtrl';
                if (controllerAs) routeDef.controllerAs = controllerAs;
                routeDef.secure = (secure) ? secure : false;
                routeDef.resolve = {
                    load: ['$q', '$rootScope', function($q, $rootScope) {
                        if (appName == 'smart' || appName == 'bms') {
                            var dependencies = [
                                routeConfig.getControllersDirectory(appName) + 'angular-controller.js',
                                routeConfig.getControllersDirectory('smart') + 'angular-library-controller.js',
                                routeConfig.getControllersDirectory(appName) + 'angular-directive.js',
                                routeConfig.getControllersDirectory(appName) + 'angular-filter.js',
                                routeConfig.getControllersDirectory(appName) + 'angular-helper.js'
                            ];
                        } else {
                            var dependencies = [

                                routeConfig.getControllersDirectory(appName) + 'angular-controller.js',
                                routeConfig.getControllersDirectory(appName) + 'angular-directive.js',
                                routeConfig.getControllersDirectory(appName) + 'angular-filter.js',
                                routeConfig.getControllersDirectory(appName) + 'angular-helper.js'
                            ];

                        }
                        return resolveDependencies($q, $rootScope, dependencies, appName);
                    }]
                };

                return routeDef;
            },

            resolveDependencies = function($q, $rootScope, dependencies, appName) {
                var defer = $q.defer();
                require(dependencies, function() {
                    defer.resolve();
                    $rootScope.appName = appName;
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

function check_is_iibrary(hostname) {
    if (hostname.indexOf("library") > -1) {
        return true;
    } else {
        return false;
    }
}