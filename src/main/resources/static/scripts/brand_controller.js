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
				$scope.listBrands();
			}, function(error) {
				$scope.error = error;
			});
		}, function(value) {
		});
	};
	
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
	};
	
	$scope.pageChanged = function() {
	    $scope.page = $scope.currentPage - 1;
	    $scope.listBrands();
	};
	
	$scope.linkTo = function(path) {
		$location.path(path);
	};
	
	$scope.listBrands();
});
