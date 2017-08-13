app.controller("sales_controller", function($scope, $http, $location, $q, ngDialog) {
	$scope.page = 0;
	$scope.limit = 5;
	$scope.fromYear = 2017;
	$scope.toYear = 2017;
	$scope.currentPage = 1;
	$scope.totalItems = 0;
	$scope.salesPerformances = null;
	$scope.salesPerformanceId = "";
	$scope.salesPerformance = {};
	$scope.model = {};
	$scope.models = [];
	$scope.brand = {};
	$scope.brands = [];
	$scope.selectedBrand = null;
	$scope.selectedModel = null;
	$scope.years = [2016, 2017];
	$scope.quarters = [1, 2, 3, 4];
	$scope.selectedYear = 2017;
	$scope.selectedQuarter = 2;
	
	$scope.listSalesPerformances = function() {
		$http.get("/api/sales", {params: {page: $scope.page, limit: $scope.limit, fromYear: $scope.fromYear, toYear: $scope.toYear}}).then(function(response) {
			$scope.salesPerformances = response.data;
			$scope.currentPage = $scope.salesPerformances.number + 1;
			$scope.totalItems = $scope.salesPerformances.totalElements;
		}, function(error) {
			$scope.error = error;
		})
	};
	
	$scope.createSalesPerformance = function() {
		$scope.salesPerformance.year = $scope.selectedYear;
		$scope.salesPerformance.quarter = $scope.selectedQuarter;
		$http.post("/api/sales", $scope.salesPerformance).then(function(response) {
			$scope.salesPerformanceId = "";
			$location.path("/sales");
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.deleteSalesPerformance = function() {
		$http.delete("/api/sales", {data: salesPerformance,  headers: {'Content-Type':'application/json; charset=UTF-8'}}).then(function(response) {
			$scope.listSalesPerformances();
		}, function(error) {
			$scope.error = error;
		});
	};

	$scope.setPage = function() {
	    $scope.currentPage = pageNo;
	};
	
	$scope.pageChanged = function() {
	    $scope.page = $scope.currentPage - 1;
	    $scope.listSalesPerformances();
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
		if($scope.salesPerformance.model == null || $scope.salesPerformance.model.brand == null || $scope.salesPerformance.model.brand.id != $scope.selectedBrand.id) {
			$q.all([$scope.listBrandModels($scope.selectedBrand)])
			.then(function(response) {
				$scope.models = response.data;
				$scope.salesPerformance.brand = $scope.selectedBrand;
				$scope.selectedModel = null;
				delete $scope.salesPerformance.model;
			});
		}
	};
	
	$scope.selectedModelChanged = function() {
		$scope.salesPerformance.model = $scope.selectedModel;
	};
	
	$q.all([
		    $scope.listBrands(), $scope.listSalesPerformances()
		]).then(function(response) {
			
	});


});