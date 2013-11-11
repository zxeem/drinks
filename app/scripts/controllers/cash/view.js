// Generated by CoffeeScript 1.6.3
(function() {
  var controller;

  controller = function(scope, params) {
    var Drink, query;
    scope.model = {};
    Drink = Parse.Object.extend("Product");
    query = new Parse.Query(Drink);
    return query.get(params.id, {
      success: function(result) {
        scope.obj = result;
        return scope.$apply(function() {
          return scope.model = result._serverData;
        });
      },
      error: function(e, err) {
        console.log(e);
        return console.log(err);
      }
    });
  };

  angular.module('drinksApp').controller('DrinkViewCtrl', ['$scope', '$routeParams', controller]);

}).call(this);

/*
//@ sourceMappingURL=view.map
*/
