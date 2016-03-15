angular.module('starter.controllers', [])
.controller('LoginCtrl', function($scope, auth, $state, store, $localStorage, $sessionStorage) {
  function doAuth() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      store.set('profile', profile);
      store.set('token', idToken);
      store.set('refreshToken', refreshToken);
      $state.go('tab.dash');
    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }

  $scope.$on('$ionic.reconnectScope', function() {
    doAuth();
  });

  doAuth();

})

.controller('DashCtrl', function($scope, $http, $localStorage, $sessionStorage, auth, store, $state) {
  var arr = JSON.parse( localStorage.getItem('profile') );
  var averageSteps = arr["averageDailySteps"];
  var userAge = arr["age"];
  var evaluation = "";
  var evaluationWithAge = "";

  // For the steps evaluation with country
  if (averageSteps < 3000) {
    evaluation = "Poorly";
  }
  else if (averageSteps < 4000) {
    evaluation = "Good";
  }
  else {
    evaluation = "Great";
  };

  // For the steps evaluation with age

  if (averageSteps < 9000 && userAge < 50) {
    evaluationWithAge = "Poorly";
  }
  else if (averageSteps < 11000 && userAge < 50) {
    evaluationWithAge = "Good";
  }
  else {
    evaluationWithAge = "Great"
  };

  // 18 to 50 years old: 12 000 steps per day
  // 50 years old: 11 000 steps per day

  $scope.$storage = $localStorage.$default({
      arr,
      "userResult": evaluation,
      "userResultWithAge": evaluationWithAge,
  });

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {reload: true});
  };
  // $scope.callApi = function() {
  //   // Just call the API as you'd do using $http
  //   $http({
  //     url: 'https://api.fitbit.com/1/user/-/profile.json',
  //     method: 'GET'
  //   }).then(function() {
  //     alert("We got the secured data successfully");
  //   }, function() {
  //     alert("Please download the API seed so that you can call it.");
  //   });
  // };

})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, auth, store, $state) {
  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {reload: true});
  };
});
