// Generated by CoffeeScript 1.6.3
(function() {
  var controller;

  controller = function(Service, location, scope, element, attrs) {};

  angular.module('drinksApp').directive('drinks', function(Service) {
    return {
      templateUrl: 'views/directives/drink.html',
      restrict: 'E',
      scope: true,
      controller: ['Drink', '$location', '$scope', '$element', '$attrs', controller]
    };
  });

}).call(this);

/*
//@ sourceMappingURL=drinks.map
*/