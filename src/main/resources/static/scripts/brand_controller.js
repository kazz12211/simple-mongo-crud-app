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
	$scope.sortColumn = "name";
	$scope.sortDir = "ASC";
	
	$scope.listBrands = function() {
		$http.get("/api/brands", {params: {page: $scope.page, limit: $scope.limit, sortColumn: $scope.sortColumn, sortDir: $scope.sortDir}}).then(function(response) {
			$scope.brands = response.data;
			$scope.currentPage = $scope.brands.number+1;
			$scope.totalItems = $scope.brands.totalElements;
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.createBrand = function() {
		if(!$scope.validateForm()) {
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
		}
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
		$http.get("/api/models/countBrandModel", {params:{brandId: brand.id}}).then(function(response) {
			var count = response.data;
			if(count == 0) {
				ngDialog.openConfirm({
					scope: $scope,
					template: 'views/brandDeleteConfirm.html',
					className: 'ngdialog-theme-default',
					showClose: false
				}).then(function(value) {
					$http.delete("/api/brands", {data: brand, headers: {'Content-Type':'application/json; charset=UTF-8'}}).then(function(response) {
						$scope.listBrands();
					}, function(error) {
						$scope.error = error;
					});
				}, function(value) {
				});
			} else {
				ngDialog.open({
					template: '<p>Brand <strong>' + brand.name + '</strong> cannot be deleted. There are ' + count + ' models exists.</p>\
					<div class="ngdialog-buttons">\
					<button class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">OK</button></div>',
					plain: true,
					showClose: false
				});
			}
		}, function(error) {
			$scope.error = error;
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
	
	$scope.sort = function(column) {
		if($scope.sortColumn == column) {
			$scope.sortDir = $scope.sortDir == "ASC" ? "DESC" : "ASC";
		} else {
			$scope.sortDir = "ASC";
			$scope.sortColumn = column;
		}
		$scope.listBrands();
	};
	
	$scope.validateForm = function() {
		$scope.validationMessages = [];
		if($scope.brand.name == null || $scope.brand.name == null) {
			$scope.validationMessages.push("Name is required.");
		}
		$scope.hasErrors =  $scope.validationMessages.length > 0;
		return $scope.hasErrors;
	};

	$scope.listBrands();
});
