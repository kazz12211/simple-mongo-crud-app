app.controller("home_controller", function($scope, $location) {
	
	$scope.linkTo = function(path) {
		$location.path(path);
	};

});
