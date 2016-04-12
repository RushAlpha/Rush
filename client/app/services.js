angular.module('rush-Services', [])
  .factory('authFactory', function($http) {
    var postSignIn = function(username, password) {
      var logInInfo = {
        username: username,
        password: password
      };
      return $http.post('/signin', logInInfo);
    };
    var postSignUp = function(username, password, isOwner, address) {
      console.log('authFactory>postSignUp: ', username, password, isOwner, address);
      var logUpInfo = {
        username: username,
        password: password,
        isOwner: isOwner,
        address: address
      };
      return $http.post('/signup', logUpInfo);
    }
    var getOwnerAddress = function(username){
      $http.post('/ownerAddress', {username: username});

    }
    return {
      getOwnerAddress: getOwnerAddress,
      postSignIn: postSignIn,
      postSignUp: postSignUp
    };
  })

  .factory('generalFactory', function($http) {

    var findDistance = function(latlng1, latlng2){

// google.maps.geometry.spherical

// computeDistanceBetween(from:LatLng, to:LatLng)

    }

    var getDeals = function(){
      return $http.get('/getOwnerDeals');
    }

    var addToDeals = function(username, password, item, price) {
      var deal = {
        username: username,
        password: password,
        item: item,
        price: price
      };
      console.log("addToDeals: ", deal);
      return $http.post('/ownerAddItemToMenu', deal);
    }
    return {
      addToDeals: addToDeals,
      getDeals: getDeals
    }
  });
