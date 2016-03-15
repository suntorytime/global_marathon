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

.controller('DashCtrl', function($scope, $http, $localStorage, $sessionStorage, auth, store, $state, Recommendations) {

  var arr = JSON.parse( localStorage.getItem('profile') );
  var averageSteps = arr["averageDailySteps"];
  var userAge = arr["age"];
  var evaluation = "";
  var evaluationWithAge = "";
  var recommendation = "";
  var recommendationsArray = Recommendations.all();
  var randomValue = recommendationsArray[Math.floor(Math.random() * recommendationsArray.length)]

  // For steps evaluation with country. Average American walks 5117 steps/day.
  if (averageSteps < 3000) {
    evaluation = "Poorly";
  }
  else if (averageSteps < 4000) {
    evaluation = "Good";
  }
  else {
    evaluation = "Great";
  };

  // For the steps evaluation with age.
  if (averageSteps < 8000 && userAge < 50) {
    evaluationWithAge = "Poorly";
    recommendation = randomValue["text"];
  }
  else if (averageSteps < 10000 && userAge < 50) {
    evaluationWithAge = "Good";
    recommendation = randomValue["text"];
  }
  else if (averageSteps < 12000 && userAge < 50) {
    evaluationWithAge = "Great";
    recommendation = randomValue["text"];
  }
  else if (averageSteps > 7000 && userAge > 50) {
    evaluationWithAge = "Good";
    recommendation = randomValue["text"];
  }
  else if (averageSteps > 9000 && userAge > 50) {
    evaluationWithAge = "Great";
    recommendation = randomValue["text"];
  }
  else {
    evaluationWithAge = "Great"
    recommendation = "Good work! Keep doing what you're doing."
  };

  $scope.$storage = $localStorage.$default({
      arr,
      "userResult": evaluation,
      "userResultWithAge": evaluationWithAge,
      "recommendation": recommendation,
  });

  $scope.logout = function() {
    auth.signout();
    store.remove('token');
    store.remove('profile');
    store.remove('refreshToken');
    $state.go('login', {}, {reload: true});
  };

  $scope.recommendations = Recommendations.all();
});
  // var geolocation = {};
  // var req =
  //   {
  //     method: 'POST',
  //     url: "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyApyLsAwWxsQ9S4YLnDdJP3yLjCWpgjrU4"
  //   };
  // var latitude = "";
  // var longitude = "";
  // var reqGeolocationUrl = "/api";
  // var reqGeolocation = {
  //   method: 'GET',
  //   url: reqGeolocationUrl,
  // };
  // $http(req).success(function(data, status, headers, config) {
  //   latitude = data["location"]["lat"];
  //   longitude = data["location"]["lng"];
  //   console.log(latitude);
  //   $http(reqGeolocation).success(function(data, status, headers, config) {
  //     console.log(data)
  //   })
  // }).error(function(data, status, headers, config){
  //       //error
  // });
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

// })

// .controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })

// .controller('AccountCtrl', function($scope, auth, store, $state) {
//   $scope.logout = function() {
//     auth.signout();
//     store.remove('token');
//     store.remove('profile');
//     store.remove('refreshToken');
//     $state.go('login', {}, {reload: true});
//   };
// });
