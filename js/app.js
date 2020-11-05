var app = angular.module('GroceryListApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
	$routeProvider
	.when("/",{
		templateUrl: "View/groceryList.html",
		controller: "HomeController"
	})
	.when("/addItem",{
		templateUrl: "View/inputItem.html",
		controller: "GroceryListItemController"
	})

	.when("/addItem/edit/:id/",{
		templateUrl: "View/inputItem.html",
		controller: "GroceryListItemController"
	})

	.otherwise({
		redirectTo:"/"
	})
});

app.service("GroceryService", function(){
	var groceryService = {};

	groceryService.groceryItem = [
	{id:1 ,completed: true, itemName:'Milk', date: new Date("October 1, 2020 11:58:00")},
	{id:2 ,completed: true, itemName:'Cookies', date: new Date("October 1, 2020 11:58:00")},
	{id:3 ,completed: true, itemName:'Veggies', date: new Date("October 3, 2020 11:58:00")},
	{id:4 ,completed: true, itemName:'Ice Cream', date: new Date("October 3, 2020 11:58:00")},
	{id:5 ,completed: true, itemName:'Eggs', date: new Date("October 4, 2020 11:58:00")},
	{id:6 ,completed: true, itemName:'Bread', date: new Date("October 5, 2020 11:58:00")},
	{id:7 ,completed: true, itemName:'Cereal', date: new Date("October 7, 2020 11:58:00")},

	] 

	groceryService.markCompleted = function(items){
		console.log(items);
		items.completed = !items.completed ;
	}

	groceryService.removeItem = function(entry){
		var index = groceryService.groceryItem.indexOf(entry);
		groceryService.groceryItem.splice(index, 1);
	};

	//console.log(typeof(groceryService));
	//console.log(typeof(groceryItem));

	groceryService.findById = function(id){
		for(var item in groceryService.groceryItem){
			if(groceryService.groceryItem[item].id === id){
				console.log(groceryService.groceryItem[item]);
				return groceryService.groceryItem[item];
			}
		}
	};

	groceryService.getNewId = function(){
		if(groceryService.newId){
			groceryService.newId++;
			return groceryService.newId;
		}else{
			var maxId = _.max(groceryService.groceryItem, function(entry){ return entry.id } );
			console.log(maxId);
			groceryService.newId = maxId.id +1; 
			return groceryService.newId;

		}
	};

	groceryService.save = function(entry){

		var updatedId = groceryService.findById(entry.id);

		if(updatedId){
			updatedId.completed = entry.completed;
			updatedId.itemName = entry.itemName;
			updatedId.date = entry.date;
		}else{
			entry.id = groceryService.getNewId(); 
			groceryService.groceryItem.push(entry); 
		}
	};

	return groceryService;
});

app.controller("HomeController", ["$scope", "GroceryService", function($scope, GroceryService){
	$scope.appTitle = "Grocery List";

	$scope.groceryItem = GroceryService.groceryItem;

	$scope.removeItem = function(entry){
		GroceryService.removeItem(entry);
	};

	$scope.markCompleted = function(items){
		GroceryService.markCompleted(items);
	};




}]);

app.controller("GroceryListItemController", ["$scope", "$routeParams", "$location", "GroceryService" , function($scope, $routeParams, $location, GroceryService){
	
	if(!$routeParams.id){
		$scope.groceryItems = { id: 0, completed:false, itemName:'', date: new Date()};
	}else{
		$scope.groceryItems = _.clone(GroceryService.findById(parseInt($routeParams.id)));
	}

	$scope.save = function(){
		GroceryService.save( $scope.groceryItems );
		$location.path("/");
	}

	//console.log($scope.groceryItem); 
}]);

app.directive("dirGrocery", function(){
	return{
		restrict: "E",
		templateUrl: "View/groceryItem.html"
	}

});