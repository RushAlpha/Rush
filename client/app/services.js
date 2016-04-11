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
      console.log(username, password, isOwner, address, "INSIDE OF POSTSIGNUP INSIDE AUTH FACTORY");
      var logUpInfo = {
        username: username,
        password: password,
        isOwner: isOwner,
        address: address
      };
      return $http.post('/signup', logUpInfo);
    }
    return {
      postSignIn: postSignIn,
      postSignUp: postSignUp
    }
  })
  .factory('generalFactory', function($http) {
    var postRush = function(rushArray) {
      var rushItems = {
        rushItems: rushArray
      };
      return $http.post('/owner', rushItems);
    }
    var addToDeals = function(item, price) {
      var deal = {
        item: item,
        price: price
      }
      console.log("Adding this deal: ", deal)
      return $http.post('/owner', deal)
    }
    return {
      postRush: postRush,
      addToDeals: addToDeals
    }
  })
