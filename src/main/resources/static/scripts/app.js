var app = angular.module("app", ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when("/", {
		controller: 'home_controller',
		templateUrl: 'views/home.html'
	})
	.when("/brand", {
		controller: 'brand_controller',
		templateUrl: 'views/brands.html'
	})
	.otherwise({
		redirectTo: "/"
	});
}]);

app.controller("home_controller", function($scope) {
	
});

app.controller("brand_controller", function($scope, $http, $location) {
	
	$scope.page = 0;
	$scope.limit = 5;
	$scope.brands = null;
	$scope.currentPage = 1;
	$scope.totalItems = 0;
	$scope.brandId = "";
    $scope.show = true;
    $scope.hide = true;
	
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
	
	$scope.createBrand = function(brand) {
		
	};
	
	$scope.editBrand = function(brandId) {
        $scope.show = false;
        $scope.hide = false;
        $scope.hideObj = true;
        $scope.showObj = true;
        $scope.brandId = brandId;
	};
	
	$scope.deleteBrand = function(brand) {
		$http.delete("/api/brands", {params: {id: brand.id}}).then(function(response) {
	        $scope.show = true;
	        $scope.hide = true;
	        $scope.hideObj = false;
	        $scope.showObj = false;
	        $scope.brandId = "";
	    	$scope.listBrands();
		}, function(error) {
			$scope.error = error;
		});
	}
	
	$scope.updateBrand = function(brand) {
		$http.put("/api/brands", brand).then(function(response) {
	        $scope.show = true;
	        $scope.hide = true;
	        $scope.hideObj = false;
	        $scope.showObj = false;
	        $scope.brandId = "";
	    	$scope.listBrands();
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
	
	$scope.listBrands();
});