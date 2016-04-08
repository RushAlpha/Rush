angular.module('rush-Services', [])
  .factory('authFactory', function($http) {
    var postSignIn = function(username, password) {
      var logInInfo = {
        username: username,
        password: password
      };
      return $http.post('/signin', logInInfo);
    };
    var postSignUp = function(username, password, isOwner) {
      console.log(username, password, isOwner, "INSIDE OF POSTSIGNUP INSIDE AUTH FACTORY");
      var logUpInfo = {
        username: username,
        password: password,
        isOwner: isOwner
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
    return {
      postRush: postRush
    }
  })