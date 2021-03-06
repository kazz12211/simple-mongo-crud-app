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
	$scope.years = [2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
	$scope.quarters = [1, 2, 3, 4];
	$scope.selectedYear = 2017;
	$scope.selectedQuarter = 2;
	$scope.pivotData = [];
	$scope.chartData;
	$scope.chartLabels;
	$scope.chartSeries;
	$scope.currentPage = 1;
	$scope.totalItems = 0;
	$scope.limit = 5;
	
	if(!$scope.selectedFiscalYear) {
		$scope.selectedFiscalYear = 2016;
	}
	
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
		if(!$scope.validateForm()) {
			$http.post("/api/sales", $scope.salesPerformance).then(function(response) {
				$scope.salesPerformanceId = "";
				$location.path("/sales");
			}, function(error) {
				$scope.error = error;
			});
		}
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
			var rec = {name: key, amount: value, selected: true};
			$scope.pivotData.push(rec);
		});
		
		$scope.totalItems = $scope.pivotData.length;
		$scope.currentPage = 1;
		createPagedPivotData();
	}

	function createPagedPivotData() {
		if($scope.pivotData.length == 0) {
			$scope.pagedPivotData = [];
		} else {
			var end = $scope.pivotData.length - 1;
			var start = ($scope.currentPage - 1) * $scope.limit;
			if(start > end) {
				$scope.pagedPivotData = [];
				return;
			}
		}
		end = start + $scope.limit;
		$scope.pagedPivotData = $scope.pivotData.slice(start, end);
	}
	
	function createChart() {
		$scope.chartLabels = ['Q1', 'Q2', 'Q3', 'Q4'];
		$scope.chartSeries = [];
		$scope.chartData = [];
		$scope.chartOptions = { legend: { display: true } };
		for(var i in $scope.pivotData) {
			var data = $scope.pivotData[i];
			$scope.chartSeries.push(data.name);
			$scope.chartData.push(data.amount);
		}
	}
	
	$scope.pageChanged = function() {
		createPagedPivotData();
	};
	
	$scope.validateForm = function() {
		$scope.validationMessages = [];
		if($scope.salesPerformance.model == null) {
			$scope.validationMessages.push("Model is not selected.");
		}
		if($scope.salesPerformance.year == null || $scope.salesPerformance.year <= 1962) {
			$scope.validationMessages.push("Year must be greater than 1962.");
		}
		if($scope.salesPerformance.quarter == null || $scope.salesPerformance.quater < 1 || $scope.salesPerformance.quater > 4) {
			$scope.validationMessages.push("Quarter must be between 1 and 4.");
		}
		if($scope.salesPerformance.amount == null || $scope.salesPerformance.amount <= 0) {
			$scope.validationMessages.push("Amount must be greater than 0.");
		}
		$scope.hasErrors =  $scope.validationMessages.length > 0;
		return $scope.hasErrors;
	};
	

	
	$q.all([
		    $scope.listBrands(), $scope.listSalesPerformances()
		]).then(function(response) {
			
	});


});