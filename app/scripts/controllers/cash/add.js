// Generated by CoffeeScript 1.6.3
(function() {
  var controller;

  controller = function(scope) {
    scope.model = {};
    return scope.create = function(form) {
      var Drink, drink;
      Drink = Parse.Object.extend("Product");
      drink = new Drink();
      scope.model.type = 'drink';
      return drink.save(scope.model, {
        success: function(object) {
          console.log("Drink has been saved");
          return scope.go('/drink/list');
        },
        error: function(_, err) {
          return console.log(err);
        }
      });
    };
  };

  angular.module('drinksApp').controller('DrinkAddCtrl', ['$scope', controller]);

}).call(this);

/*
//@ sourceMappingURL=add.map
*/