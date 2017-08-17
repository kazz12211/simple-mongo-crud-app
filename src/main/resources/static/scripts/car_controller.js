app.controller("car_controller", function($scope, $http, $location, $q, ngDialog) {
	
	$scope.page = 0;
	$scope.limit = 5;
	$scope.cars = null;
	$scope.currentPage = 1;
	$scope.totalItems = 0;
	$scope.carId = "";
    $scope.show = true;
    $scope.hide = true;
	$scope.car = {};
	$scope.model = {};
	$scope.models = [];
	$scope.brand = {};
	$scope.brands = [];
	$scope.selectedBrand = null;
	$scope.selectedModel = null;
	$scope.sortColumn = "name";
	$scope.sortDir = "ASC";
	
	$scope.listCars = function() {
		$http.get("/api/cars", {params: {page: $scope.page, limit: $scope.limit, sortColumn: $scope.sortColumn, sortDir: $scope.sortDir}}).then(function(response) {
			$scope.cars = response.data;
			$scope.currentPage = $scope.cars.number+1;
			$scope.totalItems = $scope.cars.totalElements;
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.createCar = function() {
		if(!$scope.validateForm()) {
			$http.post("/api/cars", $scope.car).then(function(response) {
		        $scope.show = true;
		        $scope.hide = true;
		        $scope.hideObj = false;
		        $scope.showObj = false;
		        $scope.carId = "";
		    	$location.path("/car");
			}, function(error) {
				$scope.error = error;
			});
		}
	};
	
	$scope.editCar = function(car) {
        $scope.show = false;
        $scope.hide = false;
        $scope.hideObj = true;
        $scope.showObj = true;
        $scope.carId = car.id;
        $scope.selectedModel = car.model;
        $scope.selectedBrand = car.model.brand;
	};
	
	$scope.deleteCar = function(car) {
		$scope.car = car;
		ngDialog.openConfirm({
			scope: $scope,
			template: 'views/carDeleteConfirm.html',
			className: 'ngdialog-theme-default',
			showClose: false
		}).then(function(value) {
			$http.delete("/api/cars", {data: car, headers: {'Content-Type':'application/json; charset=UTF-8'}}).then(function(response) {
				$scope.listCars();
			}, function(error) {
				$scope.error = error;
			});
		}, function(value) {
		});
	};
	
	$scope.updateCar = function(car) {
		car.model = $scope.selectedModel;
		$http.put("/api/cars", car).then(function(response) {
	        $scope.show = true;
	        $scope.hide = true;
	        $scope.hideObj = false;
	        $scope.showObj = false;
	        $scope.carId = "";
	    	$location.path("/car");
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.undoEdit = function() {
        $scope.show = true;
        $scope.hide = true;
        $scope.hideObj = false;
        $scope.showObj = false;
        $scope.carId = "";
	};
	
	$scope.setPage = function() {
	    $scope.currentPage = pageNo;
	};
	
	$scope.pageChanged = function() {
	    $scope.page = $scope.currentPage - 1;
	    $scope.listCars();
	};
	
	$scope.linkTo = function(path) {
		$location.path(path);
	};
	$scope.listBrands = function() {
		$http.get("/api/brands/listAll").then(function(response) {
			$scope.brands = response.data;
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.listBrandModels = function(brand) {
		$http.get("/api/models/listBrandModels", {params:{brandId: brand.id}}).then(function(response) {
			$scope.models = response.data;
		}, function(error) {
			$scope.error = error;
		});
	};

	$scope.selectedBrandChanged = function() {
		if($scope.car.model == null || $scope.car.model.brand == null || $scope.car.model.brand.id != $scope.selectedBrand.id) {
			$q.all([$scope.listBrandModels($scope.selectedBrand)])
			.then(function(response) {
				$scope.models = response.data;
				$scope.car.brand = $scope.selectedBrand;
				$scope.selectedModel = null;
				delete $scope.car.model;
			});
		}
	};
	
	$scope.selectedModelChanged = function() {
		$scope.car.model = $scope.selectedModel;
	};
	
	$scope.sort = function(column) {
		if($scope.sortColumn == column) {
			$scope.sortDir = $scope.sortDir == "ASC" ? "DESC" : "ASC";
		} else {
			$scope.sortDir = "ASC";
			$scope.sortColumn = column;
		}
		$scope.listCars();
	};
	
	$scope.validateForm = function() {
		$scope.validationMessages = [];
		if($scope.car.name == null || $scope.car.name == null) {
			$scope.validationMessages.push("Name is required.");
		}
		if($scope.car.model == null) {
			$scope.validationMessages.push("Model is not selected.");
		}
		if($scope.car.price == null || $scope.car.price <= 0) {
			$scope.validationMessages.push("Price must be greater thant 0.");
		}
		if($scope.car.year == null || $scope.car.year <= 1962) {
			$scope.validationMessages.push("Year must be greater than 1962.");
		}
		$scope.hasErrors =  $scope.validationMessages.length > 0;
		return $scope.hasErrors;
	};

	
	$q.all([
	    $scope.listBrands(), $scope.listCars()
	]).then(function(response) {
		
	});
});