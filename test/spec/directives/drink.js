// Generated by CoffeeScript 1.6.3
(function() {
  'use strict';
  describe('Directive: drink', function() {
    var element;
    beforeEach(module('drinksApp'));
    element = {};
    return it('should make hidden element visible', inject(function($rootScope, $compile) {
      element = angular.element('<drink></drink>');
      element = $compile(element)($rootScope);
      return expect(element.text()).toBe('this is the drink directive');
    }));
  });

}).call(this);
