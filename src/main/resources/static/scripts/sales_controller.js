app.controller("sales_controller", function($scope, $http, $location, $q, ngDialog) {
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
	$scope.selectedFiscalYear = 2017;
	$scope.pivotData = [];
	$scope.chartData;
	$scope.chartLabels;
	$scope.chartSeries;
	
	$scope.listSalesPerformances = function() {
		$http.get("/api/sales", {params: {fiscalYear: $scope.selectedFiscalYear}}).then(function(response) {
			$scope.salesPerformances = response.data;
			createPivotData();
			createChart();
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
	
	$scope.filter = function() {
		$scope.listSalesPerformances();
	};
	
	
	function createPivotData() {
		$scope.pivotData = [];
		var data = new Map();
	
		for(var i in $scope.salesPerformances) {
			var sales = $scope.salesPerformances[i];
			if(data.get(sales.model.name) == null) {
				var array = [0, 0, 0, 0];
				array[sales.quarter - 1] = sales.amount;
				data.set(sales.model.name, array);
			} else {
				var array = data.get(sales.model.name);
				array[sales.quarter - 1] = array[sales.quarter - 1] + sales.amount;
				data.set(sales.model.name, array);
			}
		}
		
		data.forEach(function(value, key) {
			var rec = {name: key, amount: value};
			$scope.pivotData.push(rec);
		});
	}
	
	function createChart() {
		$scope.chartLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
		$scope.chartSeries = [];
		$scope.chartData = [];
		for(var i in $scope.pivotData) {
			var data = $scope.pivotData[i];
			$scope.chartSeries.push(data.name);
			$scope.chartData.push(data.amount);
		}
		console.log($scope.chartData);
	}
	
	$q.all([
		    $scope.listBrands(), $scope.listSalesPerformances()
		]).then(function(response) {
			
	});


});