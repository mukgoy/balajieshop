// http://marcoslin.github.io/angularAMD/#/home
//http://localhost/balajieshop/welcome/timeer?t=0

require.config({
    baseUrl: baseUrl,    
    paths: {
        'jQuery': 'assets/lib/jquery/jquery.min',
        'bootstrap': 'assets/lib/bootstrap/bootstrap.min',
        'bootstrapSelect': 'assets/lib/bootstrap/bootstrap-select.min',
        'notify': 'assets/lib/notify/notify',
        'navigation': 'assets/lib/custom/custom-navigation',
        'metisMenu': 'assets/backend/vendor/metisMenu/metisMenu.min',
        'sbadmin2': 'assets/backend/dist/js/sb-admin-2',
        'angular': 'assets/lib/angularjs/angular.min',
        'angular-resource': 'assets/lib/angularjs/angular-resource.min',
        'angular-sanitize': 'assets/lib/angularjs/angular-sanitize.min',
        'angular-route': 'assets/lib/angularjs/angular-route.min',
        'angularAMD': 'assets/lib/angularjs/angular-amd',
        'ui.bootstrap': 'assets/lib/bootstrap/ui-bootstrap-tpls-2.5.0',
        'angular-controller': 'assets/backend/js/angular-controller',
        'angular-directive': 'assets/backend/js/angular-directive',
        'angular-filter': 'assets/backend/js/angular-filter',
        'angular-helper': 'assets/backend/js/angular-helper',
        'app': 'assets/backend/js/angular-app'
    },
   shim: { 
		'angularAMD': ['angular'], 
		'angular-route': ['angular'],
		'angular-sanitize': ['angular'],
		'bootstrap': ['jQuery'],
		'bootstrapSelect': ['bootstrap'],
		'notify': ['jQuery'],
		'metisMenu': ['bootstrap','jQuery'],
		'sbadmin2': ['metisMenu'],
		'navigation': ['bootstrap','bootstrapSelect','notify'],
		'ui.bootstrap': ['angular','bootstrap']
	},
   deps: ['app']
});


