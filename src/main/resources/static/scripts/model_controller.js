app.controller("model_controller", function($scope, $http, $location, $q, ngDialog) {
	
	$scope.page = 0;
	$scope.limit = 5;
	$scope.models = null;
	$scope.currentPage = 1;
	$scope.totalItems = 0;
	$scope.modelId = "";
    $scope.show = true;
    $scope.hide = true;
	$scope.model = {};
	$scope.brands = [];
	
	$scope.listModels = function() {
		$http.get("/api/models", {params: {page: $scope.page, limit: $scope.limit}}).then(function(response) {
			$scope.models = response.data;
			console.log($scope.models);
			$scope.currentPage = $scope.models.number+1;
			$scope.totalItems = $scope.models.totalElements;
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.createModel = function() {
		console.log($scope.model);
		$http.post("/api/models", $scope.model).then(function(response) {
	        $scope.show = true;
	        $scope.hide = true;
	        $scope.hideObj = false;
	        $scope.showObj = false;
	        $scope.modelId = "";
	    	$location.path("/model");
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.editModel = function(modelId) {
        $scope.show = false;
        $scope.hide = false;
        $scope.hideObj = true;
        $scope.showObj = true;
        $scope.modelId = modelId;
	};
	
	$scope.deleteModel = function(model) {
		$scope.model = model;
		$http.get("/api/cars/countModelCar", {params:{modelId: model.id}}).then(function(response) {
			var count = response.data;
			console.log(count);
			if(count == 0) {
				ngDialog.openConfirm({
					scope: $scope,
					template: 'views/modelDeleteConfirm.html',
					className: 'ngdialog-theme-default'
				}).then(function(value) {
					$http.delete("/api/models", {data: model, headers: {'Content-Type':'application/json; charset=UTF-8'}}).then(function(response) {
						$scope.listModels();
					}, function(error) {
						$scope.error = error;
					});
				}, function(value) {
				});
			} else {
				ngDialog.open({
					template: '<p>Model <strong>' + model.name + '</strong> cannot be deleted. There are ' + count + ' cars exists.</p>\
					<div class="ngdialog-buttons">\
					<button class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">OK</button></div>',
					plain: true
				});
			}
		});
	};
	
	$scope.updateModel = function(model) {
		$http.put("/api/models", model).then(function(response) {
	        $scope.show = true;
	        $scope.hide = true;
	        $scope.hideObj = false;
	        $scope.showObj = false;
	        $scope.modelId = "";
	    	$location.path("/model");
		}, function(error) {
			$scope.error = error;
		});
	};
	
	$scope.undoEdit = function() {
        $scope.show = true;
        $scope.hide = true;
        $scope.hideObj = false;
        $scope.showObj = false;
        $scope.modelId = "";
	};
	
	$scope.setPage = function() {
	    $scope.currentPage = pageNo;
	};
	
	$scope.pageChanged = function() {
	    $scope.page = $scope.currentPage - 1;
	    $scope.listModels();
	};
	
	$scope.linkTo = function(path) {
		$location.path(path);
	};
	$scope.listBrands = function() {
		$http.get("/api/brands/listAll").then(function(response) {
			$scope.brands = response.data;
			console.log("List all brands:");
			console.log($scope.brands);
		}, function(error) {
			$scope.error = error;
		});
	};

	$q.all([
	    $scope.listBrands(), $scope.listModels()
	]).then(function(response) {
		
	});
});