angular.module('owner-Module', ['rush-Services'])
.controller('ownerController', function($scope, generalFactory){
		
	$scope.declareRush = function(){

		generalFactory.postRush([dumplings, chicken, beef, pork, ramen])
		  .then(function(){
		  	console.log("Rush has been declared");
		  })
	}
})

