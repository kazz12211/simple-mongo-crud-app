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
			console.log($scope.cars);
			$scope.currentPage = $scope.cars.number+1;
			$scope.totalItems = $scope.cars.totalElements;
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.createCar = function() {
		console.log($scope.car);
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
			className: 'ngdialog-theme-default'
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
			console.log("List all brands : " + JSON.stringify($scope.brands));
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.listBrandModels = function(brand) {
		$http.get("/api/models/listBrandModels", {params:{brandId: brand.id}}).then(function(response) {
			$scope.models = response.data;
			console.log("List all models : " + JSON.stringify($scope.models));
		}, function(error) {
			$scope.error = error;
		});
	};

	$scope.selectedBrandChanged = function() {
		console.log("Selected brand : " + JSON.stringify($scope.selectedBrand));
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
	
	$q.all([
	    $scope.listBrands(), $scope.listCars()
	]).then(function(response) {
		
	});
});