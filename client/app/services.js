angular.module('rush-Services', ['uiGmapgoogle-maps'])
    .config(function(uiGmapGoogleMapApiProvider){
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyAxc_VeKSzM0c-5IOGE8mk-zLigL3QqEYA',
            v: '3.17',
            libraries: 'weather,geometry,visualization'
        });
    })
  .factory('authFactory', function($http) {
    var postSignIn = function(username, password) {
      var logInInfo = {
        username: username,
        password: password
      };
      return $http.post('/signin', logInInfo);
    };
    var postSignUp = function(username, password, isOwner, address, restName) {
      console.log('authFactory>postSignUp: ', username, password, isOwner, address, restName);
      var logUpInfo = {
        username: username,
        password: password,
        isOwner: isOwner,
        address: address,
        restName: restName
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
    var findDistance = function(latlng1, latlng2) {
        console.log("FINDING DISTANCE RIGHT NOW");
        var latitLongit1 = new google.maps.LatLng(latlng1);
        var latitLongit2 = new google.maps.LatLng(latlng2);
        console.log( google.maps.geometry.spherical.computeDistanceBetween(latitLongit1, latitLongit2));
        return google.maps.geometry.spherical.computeDistanceBetween(latitLongit1, latitLongit2);
    }
    var getLocations = function(){
      return $http.get('/getLocations');
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
      getLocations: getLocations,
      findDistance: findDistance
    }
  });

