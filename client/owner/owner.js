angular.module('owner-Module', ['rush-Services', 'ngGeolocation', 'uiGmapgoogle-maps', 'ngMaterial', 'firebase', 'timer'])
.controller('ownerController', function($geolocation, $scope, generalFactory, $state, $firebaseAuth, $filter) {

	$scope.currentTime;
	$scope.hasTime = false;

	$scope.map = {
		center: { latitude: null, longitude: null },
		zoom: 10
	};
	$scope.newCenter= {};
	$scope.uid;
	$scope.restName;
	var ref = new Firebase("https://blazing-fire-9069.firebaseio.com");
	$scope.authObj = $firebaseAuth(ref);
	$scope.rushes = [];
	$scope.decItems = [];
	//Checks if user is authenticated and will redirect to signin if not
	$scope.checkAuthentication = function() {
		$scope.authObj.$onAuth(function(authData) {
			if (authData) {
				$scope.uid = authData.auth.uid;
				generalFactory.getOwnerLocation($scope.uid).then(function(location) {
					$scope.newCenter.latitude = location.data.address.location.lat;
					$scope.newCenter.longitude = location.data.address.location.lng;

					$scope.map.center.latitude = location.data.address.location.lat;
					$scope.map.center.longitude = location.data.address.location.lng;
				})
			} else {
				$state.go('signin');
			}
		})
	}

	$scope.checkAuthentication();
	//Gets deals back from server and appends to page
	$scope.getDeals = function() {
		generalFactory.getDeals().then(function(deals) {
			$scope.rushes = deals.data.deals;
			$scope.restName = deals.data.restName;
		})
	}


		$scope.startTime = {
           value: new Date(1970, 0, 1, 12, 0, 0)
         };

         $scope.endTime = {
             value: new Date(1970, 0, 1, 12, 0, 0)
         }

        $scope.dealLength = function(start, end){ 
            var startUnix = moment(start).unix(); // 72000 Difference from 12-1
            console.log('inside deallength: ', startUnix, 'difference: ', $scope.difference);
            //$scope.difference = end - start;
            var endUnix = moment(end).unix();
            console.log("Inside dealLength: ", endUnix);
            $scope.timer(endUnix);
            
            // convert to unix time
               // insert start/end time into database
        }

        $scope.timer = function(endingTime){
        	$scope.hasTime = true;
        	$scope.currentTime = (endingTime/10) - 1440;
        	return $scope.currentTime;
        }

	$scope.getDeals();
	//Declare a rush on selected rush items
	$scope.declareRush = function() {
		$scope.decItems = $filter('filter')($scope.rushes, {checked: true})
		generalFactory.declareRush($scope.uid, $scope.decItems);
		console.log("declaredRush! on these deals", $scope.decItems);
		alert("You have declared a rush!");
	};
	//Adds new deals to our list of possible deals
	$scope.addToDeals = function() {
		generalFactory.addToDeals($scope.uid, $scope.item, $scope.price)
		.then(function(data) {
			console.log("deals are added, here are new deals", data);
			$scope.rushes.push({
				item: data.item,
				price: data.price
			});
			$state.reload();
		})
	}

	$scope.removeDeals = function(index){
		console.log("owner.js", index);
		generalFactory.removeDeals(index, $scope.uid)
		.then(function(){
			$scope.rushes.splice(index,1);
		})
	}
});
