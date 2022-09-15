//--------------------Module definition-------------------------

var weatherApp = angular.module('weatherApp', ['ngRoute', 'ngResource']); <!-- connecting module to index.html and declaring dependencies -->


//-----------------------Routes-------------------------------------

weatherApp.config(function($routeProvider){
    $routeProvider
    
    .when('/', {
        templateUrl: 'home.htm',  //relative html file
        controller: 'homeController'
    })
    
    .when('/forecast', {
        templateUrl: 'forecast.htm',
        controller: 'forecastController'
    })
    
    .when('/forecast/:daysForecasted', {  //route to get how many days we want to forecast, appends the amount of days to the url
        templateUrl: 'forecast.htm',
        controller: 'forecastController'
    })
});


//--------------------Services-----------------------------

//service to keep track of the city name and change it with the user's input
weatherApp.service('cityService', function(){   
    this.city = "Toronto, ON";
    
});

//--------------------Controllers---------------------------

weatherApp.controller('homeController', ['$scope', 'cityService', function($scope, cityService){

    
    $scope.city = cityService.city;     //add/update element 'city' to the scope service so it can be used in the text box
    $scope.$watch ('city', function(){  //$watch means this function is called whenever city variable changes
        cityService.city = $scope.city; //double binding: updates the city service variable when the user types in text box
    })
    

}]);

//controller for the forecast view and the injections we want this controller to use
weatherApp.controller('forecastController', ['$scope', '$resource', '$routeParams', 'cityService',function($scope, $resource, $routeParams, cityService){ 
    
    $scope.city = cityService.city; 
    $scope.daysForecasted = $routeParams.daysForecasted || '5';   //passes the days selected to be forecasted into the scope as a variable so that the view can use it, if no days entered it will use 5 days as default

    $scope.weatherAPI = $resource("http://api.weatherapi.com/v1/forecast.json?key=5a2bead01f6e4275a0e172019221409", {callback: "JSON_CALLBACK"}, + '&' +{get: {method: "JSONP" }});    //the api call to the weather API to get general weather data in a large JSON object format

    $scope.weatherResult = $scope.weatherAPI.get({q: $scope.city, days: $scope.daysForecasted}); //json object result we get back from the call, pass in Q for the city name and days for how many days we want to forecast, pass in the get request  

    console.log($scope.weatherResult);
    
    }]);
