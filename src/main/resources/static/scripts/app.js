var app = angular.module("app", ['ngRoute', 'ngDialog', 'ui.bootstrap']);

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
	.otherwise({
		redirectTo: "/"
	});
}]);
app.config(['$locationProvider', function($locationProvider) {
	$locationProvider.html5Mode(true);
}]);

app.controller("home_controller", function($scope) {
	
});

app.controller("brand_controller", function($scope, $http, $location, $q, ngDialog) {
	
	$scope.page = 0;
	$scope.limit = 5;
	$scope.brands = null;
	$scope.currentPage = 1;
	$scope.totalItems = 0;
	$scope.brandId = "";
    $scope.show = true;
    $scope.hide = true;
	$scope.brand = {};
	
	$scope.listBrands = function() {
		console.log("Listing brands...");
		$http.get("/api/brands", {params: {page: $scope.page, limit: $scope.limit}}).then(function(response) {
			$scope.brands = response.data;
			console.log($scope.brands);
			$scope.currentPage = $scope.brands.number+1;
			$scope.totalItems = $scope.brands.totalElements;
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.createBrand = function() {
		$http.post("/api/brands", $scope.brand).then(function(response) {
	        $scope.show = true;
	        $scope.hide = true;
	        $scope.hideObj = false;
	        $scope.showObj = false;
	        $scope.brandId = "";
	    	$location.path("/brand");
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.editBrand = function(brandId) {
        $scope.show = false;
        $scope.hide = false;
        $scope.hideObj = true;
        $scope.showObj = true;
        $scope.brandId = brandId;
	};
	
	$scope.deleteBrand = function(brand) {
		$scope.brand = brand;
		ngDialog.openConfirm({
			scope: $scope,
			template: 'views/brandDeleteConfirm.html',
			className: 'ngdialog-theme-default'
		}).then(function(value) {
			$http.delete("/api/brands", {data: brand, headers: {'Content-Type':'application/json; charset=UTF-8'}}).then(function(response) {
				console.log("response");
				$scope.listBrands();
			}, function(error) {
				$scope.error = error;
			});
		}, function(value) {
		});
	}
	
	$scope.updateBrand = function(brand) {
		$http.put("/api/brands", brand).then(function(response) {
	        $scope.show = true;
	        $scope.hide = true;
	        $scope.hideObj = false;
	        $scope.showObj = false;
	        $scope.brandId = "";
	    	$location.path("/brand");
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.undoEdit = function() {
        $scope.show = true;
        $scope.hide = true;
        $scope.hideObj = false;
        $scope.showObj = false;
        $scope.brandId = "";
	};
	
	$scope.setPage = function() {
	    $scope.currentPage = pageNo;
	}
	
	$scope.pageChanged = function() {
	    console.log('Page changed to: ' + $scope.currentPage);
	    $scope.page = $scope.currentPage - 1;
	    $scope.listBrands();
	}
	
	$scope.linkTo = function(path) {
		$location.path(path);
	}
	
	$scope.listBrands();
});