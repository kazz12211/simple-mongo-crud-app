var app = angular.module("app", ['ngRoute', 'ngDialog', 'ui.bootstrap', 'chart.js']);

app.config(['$routeProvider', function($routeProvider) {
		
    $routeProvider
	.when("/", {
		controller: 'home_controller',
		templateUrl: 'views/home.html'
	})
	.when("/brand/", {
		controller: 'brand_controller',
		templateUrl: 'views/brands.html'
	})
	.when("/newbrand/", {
		controller: 'brand_controller',
		templateUrl: 'views/newBrand.html'
	})
	.when("/model/", {
		controller: 'model_controller',
		templateUrl: 'views/models.html'
	})
	.when("/newmodel/", {
		controller: 'model_controller',
		templateUrl: 'views/newModel.html'
	})
	.when("/car/", {
		controller: 'car_controller',
		templateUrl: 'views/cars.html'
	})
	.when("/newcar/", {
		controller: 'car_controller',
		templateUrl: 'views/newCar.html'
	})
	.when("/sales/", {
		controller: 'sales_controller',
		templateUrl: 'views/sales.html'
	})
	.when("/newsales/", {
		controller: 'sales_controller',
		templateUrl: 'views/newSales.html'
	})
	.otherwise({
		redirectTo: "/"
	});
}]);
app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);


