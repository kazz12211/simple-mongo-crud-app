app.controller("home_controller", function($scope) {
	
	$scope.linkTo = function(path) {
		$location.path(path);
	};

});
